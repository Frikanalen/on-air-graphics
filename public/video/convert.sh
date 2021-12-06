for i in ./mp4/*.mp4; do 
  name=`basename -- "$i" .mp4`
  echo "$name"
  ffmpeg -i "$i" "./mkv/${name}.mkv"
done

