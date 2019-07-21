---
layout: post
title: Multitudinal Uniform Resource Parsing – Perl weekly challenge, week 17
date: '2019-07-21T23:28:22.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-07-22T00:18:38.000+10:00'
utterances: true
---

The time between posts should be smaler than this.

## Ack, part one wrote itself

The source for my solution to part one of this week's challenge looks pretty
similar to the question.

This is because of Perl 6's built in support for multi dispatch. 3 function
definitions; one symbol; branching recursions; no ifs or switches.

So I thought, what can I do to make this more interesting?

Coincidentally, for large values of m and n (mostly m), A(m,n) can be quite
slow. Also, it could be called many times for the same values of m and n.

So why not cache it?

{% highlight perl -%}

# Anonymous cache handler.
&A.wrap: -> $m, $n { .[$m;$n] //= callsame } given Array.new;

{%- endhighlight %}

What this does:

1. Creates a new Array and sets it as the topic
2. Wraps every symbol called A (there's three of them)

Every time the wrapper is called, it retrieves the cached result for a given m
and n, first setting them by calling the wrapped function *only* if no such
value is defined.

Alternatively there's built in behaviour for this if you mark the prototype as
`is cached`, but then you (a) have to declare `use experimental :cached` and (b)
get a caching mechanism that's not quite so optimised for this use case.

[Obligatory github link](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-017/fjwhittle/perl6/ch-1.p6)

## Part two sort of wrote itself, too.

Okay, so not quite. However, there's a [BNF available](https://www.w3.org/Addressing/URL/5_URI_BNF.html) 
for URI format (the example given isn't a URL, or in fact a URI as `jdbc:mysql`
is not a valid scheme owed to the colon, but it's close to a URI than a URL).

Converting BNF to Perl 6 Grammar syntax is pretty straightforward.  Mostly.  Up
to a point. I put dots in front of a lot of parts we don't actually care about.

Anyway, I wanted to actually talk about action classes again, since last time I
sort of glossed over time, but my blog post was referred to as though it was
some kind of useful reference.

The Action class - actually an instance of it is generally more useful – is
passed into the `.parse` method of a Grammar. Each method in the class is named
corresponding to a rule, token, or regex in the Grammar you're parsing that you
want to perform an action with.

Each method is called immediately after its corresponding element is matched,
and is passed the resulting `Match` when this happens. It's convenient to use
`$/` as the name of the passed in Match parameter, as you can refer to
sub-matches as `$<sub-match>` in your method.

This time our action class, `A::URLish`, has two methods, because on the whole
we just want to stringify our matches directly.

`TOP` is run when the whole thing matches. This creates an object of type URL
from (mostly) the strings that were matched by submatches of the Grammar as a
whole. The exceptions are the `.query` property, which is built up into a hash
from the `<param>` elements of the `<query>` submatch, and the `.userinfo`
property, which is "made" by another method specially for it.

This is where things get cooler.

Grammars allow you to specify a prototype for a kind of multi-dispatch
subexpression. In our case, the `<userinfo>` expression has been defined this
way, so that we have a regex `userinfo:sym<user-pass>` that parses specifically
a `<user>:<password>` style authentication string, but when we're referring to
it later, either in the Grammar or the Actions class, we only have to say
`<userinfo>`. In this way, we could extend it later to accept a different style
of authentication string.

In the action class, we just write a `method userinfo:sym<user-pass>` which
makes a `URL::UserInfo` object (it would be better if this were a role our
specific class `does`), and when we call `$<userinfo>.made` in the `TOP` method,
this is what we get back. Note how the calling function doesn't need to know
which particular userinfo symbol we're calling, just that it was matched and
made by *some* userinfo. Polymorphism in regular expression parsers.

[Also you can find this on github](https://github.com/fjwhittle/perlweeklychallenge-club/blob/master/challenge-017/fjwhittle/perl6/ch-2.p6)

Apologies for the poor quality explanation.

'til next time...
