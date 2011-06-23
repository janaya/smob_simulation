from generate_random_interests import  get_random_line
from datetime import datetime
import sys

def create_batch_posts(num_posts):
  fdfeed = open("rss/feed.rss")
  datafeed = fdfeed.read()
  for n in range(1,num_posts+1):
    hashtag = get_random_line("interests_hashtags_words.txt", 1)
    #random.randint(1, 10)
    dt = datetime.now()
    date = dt.strftime("%Y-%m-%dT%H:%M:%S+01:00")
    datafeed = datafeed.replace('2011-04-27T14:26:46+02:00',date)
    datafeed = datafeed.replace('<http://dbpedia.org/resource/Microblogging>', hashtag)

    fdnewfeed = open("rss/feed%s.rss" % n, "w")
    fdnewfeed.write(datafeed)
    fdnewfeed.close()
  fdfeed.close()
    
if __name__ == '__main__':
  num_posts = int(sys.argv[1])
  create_batch_posts(num_posts)
