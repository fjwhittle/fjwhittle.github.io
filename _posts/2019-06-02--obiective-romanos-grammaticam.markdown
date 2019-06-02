---
layout: post
title: Obiective Romanos grammaticam – Perl weekly challenge, week 10
date: '2019-06-02T10:07:37.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-06-02T11:04:22.000+10:00'
utterances: true
---

My high school Latin teachers are now writhing in horror because of my blog post
title for the
[Perl Weekly Challenge 010](https://perlweeklychallenge.org/blog/perl-weekly-challenge-010/)

## Class action against Roman grammar

One of the super strong parts of the Perl 6 language is the ability to structure
your regular expressions into expressive and easy to understand grammars, and
pair them with a class that operates on each matching sub-expression in a sort
of love letter to hierarchical abstract syntax trees.

This is great for turning a string of specific letters into a number using a
vaguely defined set of rules – many people would (**almost** correctly) say that
`CMCMXLXLIIIIII` is not a valid Roman numeral, but that shouldn't stop us from
parsing it.

So I put together a grammar where each part of the input is parsed as:

{% highlight perl -%}
[ <prefix> <numeral> ]* <suffix>
{%- endhighlight %}

Where `prefix` must be the smaller decimal prefix ((X, V) ⇒ I, (C, L) ⇒ X, (M,
D) ⇒ C) of `numeral`, and `suffix` is the sub-expression parsing the next
smallest numeral.

I then parse the input string using this grammar and a class with equivalent
named methods.  Each method:
* Determines the value matching numerals,
* Adds the already calculated suffix value, then
* subtracts the prefix value(s).

The result parses numerals that are strictly correct according to rules invented
long after the fall of the Roman empire, and also a whole lot of stuff that
looks weird, in the spirit of minimal but effective validation.

### And the other way

The solution to this is almost self documenting.

* Map each component from its value to its numeral (or numeral pair in the case of subtractive prefixes),
* then loop through these, assigning the required number of each component.

Conveniently, only one of any half-decimal or subtractive prefix will fit into
the remainder of its decimal predecessor, so nothing extra has to be done for
strictly conforming output.

[Github link to solution](https://github.com/manwar/perlweeklychallenge-club/blob/master/challenge-010/fjwhittle/perl6/ch-1.p6).

## Bags of distance between Jaro-Winkler

The Jaro-Winkler distance of two strings is just one minus their similarity,
which is a fairly inoffensive algorithm that takes the Jaro similarity and adds
a weight based on up to the first four letters of the word being the same (which
produces some differences like for example vettel will match vent more closely
than event does).

The Jaro similarity algorithm seemed pretty simple to implement at first glance
– just take all the characters that are in both strings, and average these
between the length of both strings and the number of transposed / out of
sequence characters, and in fact I had an implementation of this working to my
satisfaction before I realised that I'd missed something important.

The matching characters cannot be more that half the length of the longer of the
two strings away from each other.

I *had* put together an elegant solution that would intersect the combed arrays
of the two strings together, and then loop through the matching characters in
sequence according to the first string, adding transpositions for any character
that was not in the right place in the second string, and now I had to replace
one line with an ∩ operator with a highly inelegant looking loop through the
first string and marks off any matching character with the second string within
the specified distance limits, unless it's already been marked off.

Due to being unable to find more than two pieces of test data (that work the
same with or without the distance restriction), I'm not sure if it's even
correct.

[Well it's on Github anyway](https://github.com/manwar/perlweeklychallenge-club/blob/master/challenge-010/fjwhittle/perl6/ch-2.p6).
