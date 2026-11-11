#!/usr/bin/env python3
"""Record a development CasparCG channel with its FFmpeg FILE consumer.

Example:
  python3 scripts/capture-caspar.py --url http://HOST:4175/graphics/?dev=false \
      --seconds 10 --file refresh-dolly.mkv

The file is written in CasparCG's media directory, not the client's cwd.
Only use on a development channel; --url replaces the specified producer layer.
"""
import argparse
import re
import socket
import time


def quote(value):
    if any(c in value for c in ['"', '\\', '\r', '\n']):
        raise ValueError('AMCP arguments must not contain quotes, backslashes or newlines')
    return '"' + value + '"'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=5250)
    parser.add_argument('--channel', type=int, default=1)
    parser.add_argument('--layer', type=int, default=10)
    parser.add_argument('--url')
    parser.add_argument('--file', default='refresh-capture.mkv')
    parser.add_argument('--seconds', type=float, default=10)
    args = parser.parse_args()
    if args.seconds <= 0 or args.channel <= 0 or args.layer < 0:
        parser.error('seconds/channel must be positive, layer non-negative')
    file_arg = quote(args.file)

    def command(text):
        with socket.create_connection((args.host, args.port), timeout=10) as sock:
            sock.settimeout(10)
            sock.sendall((text + '\r\n').encode())
            result = b''
            while b'\r\n' not in result:
                chunk = sock.recv(4096)
                if not chunk:
                    raise RuntimeError('AMCP connection closed before response')
                result += chunk
        line = result.split(b'\r\n')[0].decode()
        if not re.match(r'20[012] ', line):
            raise RuntimeError(f'{text}: {line}')
        print(line, flush=True)

    if args.url:
        command(f'PLAY {args.channel}-{args.layer} [HTML] {quote(args.url)}')
    command(f'ADD {args.channel} FILE {file_arg} -codec:v libx264 -preset:v ultrafast -crf:v 0 -an')
    try:
        deadline = time.monotonic() + args.seconds
        while time.monotonic() < deadline:
            time.sleep(min(1, max(0, deadline - time.monotonic())))
    finally:
        command(f'REMOVE {args.channel} FILE {file_arg}')
    print(f'Finalized {args.file} on {args.host}; extract a still with ffmpeg -sseof -0.05 -i FILE -frames:v 1 still.png')


if __name__ == '__main__':
    main()
