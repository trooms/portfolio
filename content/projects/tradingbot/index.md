---
index: 0
type: project
title: Sentiment Trading Bot
date: 'Feb. 2020 - Jan. 2021'
description: 'LSTM recurrent neural net creating expected stock price changes based on social media sentiment around a given stock'
tools: 'Python | Pandas | PyTorch | PostegreSQL'
---
## Argus 
> Argus Panoptes (All-seeing; Ancient Greek: Ἄργος Πανόπτης) or Argos (Ancient Greek: Ἄργος) is a many-eyed giant in Greek mythology. The figure is known for having generated the saying "the eyes of Argus", as in to be "followed by the eyes of Argus", or "trailed by" them, or "watched by" them, etc.
> - [Wikipedia](https://en.wikipedia.org/wiki/Argus_Panoptes)

Dubbed *Argus*, this project was meant to be an all seeing, all knowing prediction of stock movement based on perception in media.

The idea came about a couple months before the huge [r/WallstreetBets](https://en.wikipedia.org/wiki/R/wallstreetbets) short squeeze.

Despite being a freshman at the time, I met a PhD candidate in Neuroscience at Stanford, a former SpaceX Telemetry Software Engineer, and a Biomedical Engineering new grad from Boston University while playing basketball; all of whom got on board the project.

We didn't end up making any money and the project was eventually abandoned, but for a short time during covid we all got together and coded nonstop like we were in *The Social Network* (tldr; it was fun).

## Code

As for the actual implementation, the core was to esentially feed in as much data about a specific stock as possible as a time series and attempt to correlate that data with the actual time series data of a specific stock.

I worked primarily on the sentiment analysis (preprecossed for the rnn) and the neural network design.

### Here are some of the inputs we used:
```python
async def get_post_stats(conn, current_time, end_time, batch_ids):
    query = """SELECT
                    ps.post_id,
                    ps.scraped_at,
                    ps.score,
                    ps.ratio,
                    ps.comments
                --- ps.awards
                --- ps.ranks
                FROM post_stats ps
                WHERE scraped_at BETWEEN $1
                AND $2
                AND ps.post_id = any($3::text[])
         """
    result = await conn.fetch(query, current_time, end_time, batch_ids)
    return result


async def get_tier_outcome(conn, batch_ids):
    query = """
                SELECT
                    posts.id,
                    posts.time_t1
                FROM posts
                WHERE posts.id = any($1::text[])
         """
    result = await conn.fetch(query, batch_ids)
    return result
```
We used a PostgreSQL database to store everything and retrieved data via the (now deprecated) Reddit API.

Sentiment analysis was done with a basic sentiment analysis library (the 'ratio' key) and then finally everything was uploaded to the database

### Preparation I wrote before backpropogation:
```python
    sort_weight_matrix = [
        np.arange(size, 0, -1, dtype=float) for size in data_shape
    ]

    mask_time_length = [
        np.pad(np.ones(len(post)), (0, (longest_data - post.shape[0])))
        for post in sort_weight_matrix
    ]
    sort_weight_matrix = [
        np.pad((post / (np.sum(post) * 2)), (0, (longest_data - post.shape[0])))
        for post in sort_weight_matrix
    ]
    sort_weight_matrix = np.stack(sort_weight_matrix)
    sort_weight_matrix = torch.tensor(sort_weight_matrix, dtype=float).to(
        device, non_blocking=True
    )
    mask_time_length = np.stack(mask_time_length)
    mask_time_length = torch.tensor(mask_time_length, dtype=float).to(
        device, non_blocking=True
    )

    tier_outcome_binary = [
        1 if post['time_t1'][0] is not None else 0 for post in dataset
    ]

    tier_outcome = [
        np.ones(longest_data, dtype=float)
        if post['time_t1'][0] is not None
        else np.zeros(longest_data, dtype=float)
        for post in dataset
    ]

    tier_outcome = np.stack(tier_outcome)
    tier_outcome = torch.tensor(tier_outcome).float().to(device, non_blocking=True)
```

We essentially wanted to make the data readable for an LSTM type output and decided on an LSTM because it intuitively matched how we understood time series data (We also cherry picked some random research papers to support our claims).

### A simple word cloud I wrote to visualize our database
```python
# this line is an array to help split the learning of the agent using ml
from sklearn.model_selection import train_test_split

# this gives us the lib corpus that detects the key neg, pos, neu stop words
from nltk.corpus import stopwords
from nltk.classify import SklearnClassifier

# this is what this script using as the plot lib if anyone has something better feel free to share please
import matplotlib.pyplot as plt

#%matplotlib
from wordcloud import WordCloud, STOPWORDS
from subprocess import check_output


def categorizer(sentiment):
    polarity, subjectivity = sentiment
    if polarity < 0.1 and polarity > -0.1:
        return "Neutral"
    if polarity > 0:
        return "Positive"
    if polarity < 0:
        return "Negative"


data["sentiment_text"] = data["sentiment"].apply(categorizer)
print(data)
train, test = train_test_split(data, test_size=0.5)
# example of removing neu,pos,neg sentiment if needed, might be too much data to proccess if irrevalant
# train = train[train.sentiment != "Neutral"]
#  Expects a table with a text colmn and a sentiment coluymn
#  the text column has the body of a tweet, and the sentiment has the sentiment of the tweet
#  this is expected to be part of the training dataset
#  The tweets are then categorized by sentiment into positive, neutral, negative
#  Whatever sentiment a post is applies to all the tickers the post mentions
train_neu = train[train["sentiment_text"] == "Neutral"]
train_neu = train_neu["text"]
train_pos = train[train["sentiment_text"] == "Positive"]
train_pos = train_pos["text"]
train_neg = train[train["sentiment_text"] == "Negative"]
train_neg = train_neg["text"]


def wordcloud_draw(data, color="black"):
    #  Takes all the tweets and combines them into one big text blob separated by spaces
    words = " ".join(data)
    #  turns big text blob into array of words, loops through each word to filter some out, then combine back into big text blob
    cleaned_word = " ".join(
        [
            word
            for word in words.split()
            # might need to remove this line since i dont know if htt is included in scrapped data
            if "http" not in word
            # more filters can be included later
            and not word.startswith("@") and not word.startswith("# ")
            # we will see what this may include
            # and word != ''
        ]
    )
    wordcloud = WordCloud(
        stopwords=STOPWORDS, background_color=color, width=2500, height=2500
    ).generate(cleaned_word)
    plt.figure(1, figsize=(16, 16))
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.show()


print("Neutral words")
wordcloud_draw(train_neu)
print("Positive words")
wordcloud_draw(train_pos, "white")
print("Negative words")
wordcloud_draw(train_neg)
```

## Final Thoughts
Overall the project was an intensely rewarding introduction to software development in teams. I learned a lot about fast-paced development and various applications of advanced computer science.