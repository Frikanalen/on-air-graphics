for i in ./mp4/*.mp4; do 
  name=`basename -- "$i" .mp4`
  echo "$name"
  ffmpeg  -i "$i"  -b:v 0  -crf 30  -pass 1  -an -f webm -y /dev/null
  ffmpeg  -i "$i"  -b:v 0  -crf 30  -pass 2  "./webm/${name}.webm"
done

