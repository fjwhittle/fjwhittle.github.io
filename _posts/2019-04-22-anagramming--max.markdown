---
layout: post
title: Anagramming to the Max – Perl weekly challenge, week 5
date: '2019-04-22T15:36:33.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-04-22T16:34:22.000+10:00'
utterances: true
---

## Some repetition for challenge one.

As [hinted at in my previous entry]( {%- post_url 2019-04-15-no-pi-file
-%}#letters-in-words-in-list-in--), the difference between finding words that
contain a particular sequence (in any order) and finding anagrams is somewhat
minor.

In fact, the only appreciable difference between my
[week 4 challenge 2 solution](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-004/fjwhittle/perl6/ch-2.p6)
and my [week 5 challenge 1 solution](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-005/fjwhittle/perl6/ch-1.p6)
in context is the replacement of a `⊆` operator with a `===` operator.

```
$ perl6 ch-1.p6 /usr/share/dict/words top
opt, pot, top
```

## Build it up to tear it down in challenge two.

I feel like what I ended up doing for challenge two was somewhat in the Perl 5
idiom. Each line of the file is processed into a sorted sequence of letters,
which is used as a key in a Hash of `SetHash`es where the key of the second
dimension is the `.lc`ed word itself to avoid counting duplicates.

Once the Hash is built, the maximum number of elements is found, and each entry
with that number of elements is printed out — I've used a formatter to show the
sequences, the number of matched words, and the words themselves.

See the full solution at [https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-005/fjwhittle/perl6/ch-2.p6](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-005/fjwhittle/perl6/ch-2.p6)
