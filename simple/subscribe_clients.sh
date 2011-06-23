for i in $(seq 2 3); do node subscribe_clients.js $i&; done

#!/bin/bash
for i in $(seq 5)
do
  echo "Welcome $i times"
done
