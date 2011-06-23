#!/usr/bin/env python
#http://www.bryceboe.com/2009/03/23/random-lines-from-a-file/
import os, random, sys
 
def get_random_line(text_file, num_lines):
    def error_exit(msg):
        sys.stderr.write(msg)
        sys.exit(1)
 
    # Verify arguments
    if not os.path.isfile(text_file):
        error_exit('%s does not exist, or is not a file\n' % text_file)
 
    seeks = [0 for x in range(num_lines)]
    file = open(text_file)
    count = 0
    prev = 0
 
    # Calculate Random Lines
    while file.readline():
        for i in range(num_lines):
            if random.randint(0, count) == 0:
                seeks[i] = prev
        prev = file.tell()
        count += 1
 
    random_lines = []
    # Print Random Lines
    for i, pos in enumerate(seeks):
        file.seek(pos)
        print '%d: %s' % (i, file.readline().strip())
        random_lines.append(file.readline().strip()) 
    return random_lines[0]
    file.close()
    
if __name__ == '__main__':
  text_file = sys.argv[1]
  num_lines = int(sys.argv[2])
  get_random_line(text_file, num_lines)
