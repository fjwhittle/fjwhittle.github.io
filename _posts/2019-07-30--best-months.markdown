---
layout: post
title: Greedy expression of the best months – Perl weekly challenge 19
date: '2019-07-30T00:08:30.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-08-05T00:05:36.000+10:00'
utterances: true
---

## The best months to be alive in

The first challenge this week is to list all the months between 1900 and 2019
with three weekends in them (Friday, Saturday, Sunday).

This in itself sounds like hard work, so let's be tricky instead. We know that
in a 28 day period there are exactly 4 weekends, so in order for a month to have
5 weekends, it must have at least 3 days more than that, or 31 days. As we know
that the longest months have 31 days it follows that we're therefore looking for
*only* months that have 31 days. First criteria.

We can also determine that the last three days must be Friday, Saturday, Sunday,
which also means that the first day of the month must be a Friday.  Second
criteria.

So the simplified criteria for this challenge are that we're looking for 31 day
months that start on a Friday.

We can do this pretty easily with a sequence:

{% highlight perl -%}
(Date.new('1900-01-01'), *.later(:1month) ... Date.new('2019-12-01')).\
  grep({.day-of-week == 5 and .days-in-month == 31});
{%- endhighlight %}

Which gives a bunch of Dates in YYYY-MM-DD format, so let's neaten it up with an
enum of months and mapped output:

{% highlight perl -%}
my enum Month «:1January February March April May June July August September October November December»;

(Date.new('1900-01-01'), *.later(:1month) ... Date.new('2019-12-01')).\
  grep({.day-of-week == 5 and .days-in-month == 31}).\
  map({"{Month(.month)} {.year}"})».say;
{%- endhighlight %}

[Here be codeses](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-019/fjwhittle/perl6/ch-1.p6)

## Greedy lines are regularly expressed.

The second challenge is to implement line wrapping using the greedy algorithm.

Because the greedy algorithm just inserts as many words as it can onto a single
line, it never needs to re-evaluate past rows, so we can do this in a fairly
straightforward way by combing the input with a regular expression, and
`put`ting the results.

For just a paragraph, we should only need the comparatively simple:

<pre>
/ \s * <( <-[ \n ]> ** { 1..($column-1) } \S )> [ \s+ || $ ] /
</pre>

Which will find:

* Up to the specified column less 1 of non-newline characters, followed by a
  non-whitespace character.
* Trailing whitespace – which is discarded; or the end of input

However this will discard the first *$column* × *n* characters of any word
that's longer than the specified column length.  So we branch it:

<pre>
/ || \s * <( <-[ \n ]> ** { 1..($column-1) } \S )> [ \s + || $ ]
  || \S ** { $column }
/
</pre>

Now we aren't losing large amounts of really long words. Yes I added an extra
`||` at the start – Perl6 regexes let you do that, as the empty branch before
never matches, and IMO it neatens things up a bit.

But to go overboard a bit, we can also handle multiple paragraphs separated by
blank lines:

<pre>
/ || )> \s *? \n
  || <( <-[ \n ]> ** { 1..($column-1) } \S )>
	 <?before [ \s || $ ]> <[ \s ] - [ \n ]>* \n ?
  || \S ** { $column }
/
</pre>

Now we've re-arranged things a bit so:

* The first branch matches trailing whitespace and whitespace only lines, but
  gives an empty string so when we `put` this match we *only* output a newline.
* The second branch will now only suck up whitespace up to a single newline.

This preserves any paragraph breaks.

Insert this into a `.comb()` and `put` the output, and Bob's yer uncle.

[Check it out](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-019/fjwhittle/perl6/ch-2.p6).
