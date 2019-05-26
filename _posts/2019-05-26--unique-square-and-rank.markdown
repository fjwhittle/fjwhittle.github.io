---
layout: post
title: A unique square and rank – Perl weekly challenge, week 9
date: '2019-05-26T19:12:11.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-05-26T22:01:18.000+10:00'
utterances: true
---

So I'm back again for the [Perl Weekly Challenge
009](https://perlweeklychallenge.org/blog/perl-weekly-challenge-009/)

## First square number that has at least 5 distinct digits

Challenge #1 demonstrates again the power of lazy lists. I think generating
results from lazy lists is pretty much becoming my favourite feature of Perl 6
by default – I find a use for it so frequently.

In this case we lazily generate a list from 0 to infinity – `(^∞)` is basically
a term, right? – map it to a list of square numbers with `.map(* ** 2)`, and
then filter to numbers that have 5 unique digits.

To do this I used Bags (Sets would have worked too):

{% highlight perl %}
.grep(*.comb.Bag.elems >= $digits)
{% endhighlight %}

Where `$digits` is in this case 5 (the default for a value entered on the
command line in my solution). This will find **all** the Square numbers with at
least 5 digits, but it will literally take forever, so best to cut it short at
the first one with a `[0]`.

As usual, it's [on
github](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-009/fjwhittle/perl6/ch-1.p6)
if you care.

## Varying styles of rank

Insert standard rant about vague specifications here. In the end I got 20
copypasta from a random name generator and `Z=>`pped them up to a dice roll out
of 10.

All the same, I went relatively all out on this one. Not because the challenge
was hard, but because it's a nice opportunity to (completely superfluous) play
with multi dispatch.

`RankMode` is an enum of the ranking modes, `<rank-standard rank-modified
rank-dense>`. Again, this is entirely unnecessary (actually I added it on at the
end).

Now I can stick it in a multi dispatch prototype though (more stuff I added
later):

{%- highlight perl -%}my proto rank($, RankMode, &?) { * }{%- endhighlight -%}

`$` basically indicates the first argument is some kind of container, `RankMode`
is as above, and `&?` indicates the third argument is a routine and is
**optional**.

Following this (in source order - chronologically I did them first), I have
three multi declarations that look like:

{% highlight perl %}
my multi rank(@scores where { $_».?value.all ~~ Int },
              rank-standard,
              &ranking = {$^b.key <=> $^a.key}) { ... }
{% endhighlight %}

With `rank-modified` and `rank-dense` substituted for `rank-standard` in the
second and third sub's signatures. This allows us to make apparently the same
function call but a *different* implementation is used depending on what
`RankMode` is given.

You might have noticed the `where` constraint on the `@scores` argument. This is
to ensure that a list of Pairs has been passed (or at least of somethings that
implement .value) with all the values being integers.  This is actually a little
contrary to the flexibility provided by having a `&ranking` call back, but
provides an early indication of something that would prevent the internals of
these functions working – and if we wanted to rank something with a different
structure later we could add another version of rank with another constraint and
both would still work.

The contents of these subroutines is very similar, where:
+ First, it inverts the list of scores added to it (this is why we compare the
  key in the default `&ranking`) and create a Hash from this, meaning that keys of
  the `@scores` argument get grouped together according to their score.
+ Then each group of Pairs is mapped to its ranking and spat out into an output
  array, with the Pair inverted back to its original order.
+ Somewhere in this rank of the group *or* the one following it is determined in
  the way appropriate for each implementation.

I'm actually a little frustrated that when I tried to do this with a mapping
function, my `$n` ranking variable would always be evaluated before anything was
mapped to the output, which made the `rank-standard` routine behave the same as
the `rand-modified` one; if anyone has any ideas on how to avoid this, I'd love
to hear them. The implementation was:

{% highlight perl %}
Hash.new.append(@scores.invert).pairs.sort(&ranking) {
  my $e = .invert.map: {$n => $_};
  $n += .value.elems;
  |$e;
}
{% endhighlight %}

**Anyway** I also have a fourth multi-sub:

{% highlight perl %}
my multi rank(%scores, RankMode $mode, &ranking = {$^b.key <=> $^a.key}) {
  rank(%scores.pairs, $mode, &ranking);
}
{% endhighlight %}

Which allows me to call `rank` with a Hash, which it will turn into a list of
pairs, and then pass it on to the appropriate subroutine according to the given
`$mode`. Which is just kind of cool.

There's not a single if statement in my code.  You can check this [on
github](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-009/fjwhittle/perl6/ch-2.p6)

## Optional challenge

Again I'm opting out of this one, for the same reasons as last week, and also
because I started this challenge late owed to being at said `$day-job` all week
(which I wasn't before).

If I **was** to have a go at this one though, I'd probably use
[Cro::HttpClient](https://cro.services/docs/reference/cro-http-client) though,
because it will even marshal objects to JSON for me.
