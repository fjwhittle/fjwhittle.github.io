---
layout: post
title: Squaring up to the Perfect Centre – Perl weekly challenge, week 8
date: '2019-05-16T08:34:24.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-05-16T10:39:07.000+10:00'
utterances: true
---

Blogging back, for the [eighth Perl weekly
challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-008/).

This week our two challenge were to calculate the first 5 perfect numbers, and
to centre a series of lines on the page.

## Perfect Numbers

I'm a little late to the blog this week, so I've had a look at what other people
did before writing this up (I did my solution before checking out others'), and
it looks like a number of people tried to filter the list of positive integers
directly. As they discovered, this is mostly fine for the first four perfect
numbers, but the fifth…  takes a while to discover this way.  I didn't run into
this timing issue, because I like to generate.

### How do generate perfect number?

The first step is to find an algorithm. This is pretty well documented on the
[Wikipedia page](https://en.wikipedia.org/wiki/Perfect_number):

- Euclid proved that all numbers of the form *q*(*q* + 1) / 2 are perfect numbers
  where *q* is (what would later be known as) a Mersenne Prime.
- Much more recently, Euler proved that in fact *all* perfect numbers are formed
  like this.

So the answer then is to generate Mersenne primes, and calculate perfect numbers
using these.

### Lazily we Mersenne

A Mersenne prime is of the form 2*<sup>p</sup>* - 1 where *p* is a prime number. So we
lazily gather a list of all prime numbers up to ∞, check if they're prime, apply
the formula, and then check if the result is prime as well, because the sequence
**can** produce composite numbers, but Mersenne numbers / primes are always
prime.

I bound this to the term `M`:

{% highlight perl %}
my \M := (^∞)
           .grep(*.is-prime)
           .map(-> $n { 2 ** $n - 1})
           .grep(*.is-prime);
{% endhighlight %}

### Perfect Map

The next step is to bind a mapping of the Mersenne primes to the corresponding
perfect number:

{% highlight perl %}
my \P := M.map: -> $q { $q * ($q + 1) div 2 };
{% endhighlight %}

I used `div` so the result is `Int` not `Rat`.

### Finally, get the results

`P` is now a lazily generated array that will find the *n*th Perfect
number as `P[n]`.  `^5` gives a list of the first 5, so

{% highlight perl %}
P[^5]».put
{% endhighlight %}

Gets the first 5 perfect numbers, then prints each one on its own line.

## Text centring

Nothing special here. Like most other people, I found the maximum line length,
then padded the average of this and the line length on the left.
Only things I did different from what I can see:

- Used sprintf.  The `%*s` format specifier lets me pass in the amount of
  padding without interpolation.
- Filtered through `.trim` to get rid of any surrounding spaces, because
  paranoia.

## Optional API challenge

Writing a simple client for the Mailgun API is distressingly similar to the kind
of work I do in `$day-job`, so I've opted not to do this one, as it would be a
sad reminder that life would be so much better if I didn't have to PHP.
