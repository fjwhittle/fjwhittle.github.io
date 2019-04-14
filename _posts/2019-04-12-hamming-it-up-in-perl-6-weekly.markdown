---
layout: post
title: Hamming it up in Perl 6 – the weekly challenge, week 3
date: '2019-04-12T22:08:00.000+10:00'
author: Francis
tags:
- perlweeklychallenge
- perl6
modified_time: '2019-04-13T01:47:27.441+10:00'
redirect_from: '/2019/04/hamming-it-up-in-perl-6-weekly.html'
---

Okay, so first up, I started with the [Perl weekly challenge](https://perlweeklychallenge.org/) in its [third week](https://perlweeklychallenge.org/blog/perl-weekly-challenge-003/); I hadn't heard of it in week 1, and wasn't sure if I should submit in week 2 (also as noted on the official blog, week 2 was absurdly simple Perl 6, and I'll be focusing on that).

## Generating some 5-smooth numbers

My first thought was to naïvely loop through integers, starting from 1, until we found the appropriate numbers. Pretty simple:

{% highlight perl6 %}
(gather for 1..* -> $k {  my $n = $k;
  for (2, 3, 5) -> $x { $n /= $x until $n % $x }
  $n == 1 and take $k
})[$i].put
{% endhighlight %}

(Yes, that's an implicit lazy list 😊)
This is pretty effective, and actually reasonably fast for small numbers; It finds the 52nd (`$i = 51 / 256`) in .037s on my aging Athlon II (not counting compile time).

However, as a solution, it does not scale well. Up to around the index mentioned above, it beats the algorithmic solution I'm about to talk about, but as the density of 5-smooth numbers decreases, the efficiency decreases, and the naïve loop gets exponentially slower; Finding the 104th number takes ~1.6s; The 208th, nearly 16.  The 1691st which the Rosetta Code page specifies because it's the highest 5-smooth number below 2³¹ takes so long that I gave up in timing it.  The millionth… who knows?

## Enter Hamming's problem

The Wikipedia page on 5-smooth / Regular / Hamming numbers [describes an Algorithm](https://en.wikipedia.org/wiki/Regular_number#Algorithms) postulated by Dijkstra to (of course) describe the set of Hamming numbers as a recursive sequence made up of three smaller sequences – essentially you start with the first Hamming number (1), then for each of 2 3 and 5, multiply by  the known set of Hamming numbers ad nauseam to increase the length of those sub-sequences.

I'll note now that there's actually a slightly different [Perl6 solution on Rosetta Code](https://rosettacode.org/wiki/Hamming_numbers#Perl_6), which calculates the powers of 2, 3, and 5 up to a predefined limit and merge sorts the three sequences together. The results are correct, but will always calculate the same sized sequence, which may be either too small or larger than you need. Maybe when a challenge winner is determined we can update Rosetta Code with that solution.

On the other hand, Perl 6 makes this pretty easy with gather / take because you can reference a list inside its own gather block, allowing you to to just keep multiplying by 2 3 and 5 for as long as you need (`@results = @results X* (2,3,5)`).  Unfortunately, even at the second iteration, the results will come out of order and with duplicates (1 2 3 5 4 6 10 6 9 10 15 25).  We can deal with the duplicates to an extent, but ultimately need to sort and uniquify the entire list every iteration.  This ⓐ forces the list to be eager, ⓑ is as slow if not slower than the sieve we implemented earlier, and ⓒ is somewhat inelegant.  I actually went through a couple of iterations of this anyway and found that a pure Perl 6 merge algorithm that sliced the next three results into the appropriate array indices was much faster that calling sort (also a merge sort) on the entire array. Still not fast enough though.

I had a look at implementing a solution with competing Channels or Supplies, but as Wikipedia said, “explicitly concurrent generative solutions might be non-trivial,” and I kept hitting dead ends along the lines of ‘how do I make it deliver the correct next result and stop at the right time.’

So then I sort-of cheated and had a peek and the Python implementations mentioned by Wikipedia for inspiration.
It took me a while to figure out what it was doing, but after a while (I won't lie, it was something like 6 hours – I'm not great at Python), I figured out that it was merging the results of three generators to yield the minimum result of those.

Perl 6 does't really do generators the way that Python does, and I decided quickly that nesting gathers wasn't likely to work well.  The solution was to have concurrent iterators on the list being gathered, and pick the smallest result.  A couple of variations on if/elsif on three dimensions, I came to the realisation that I could just .min the three next results and advance the iterators that matched this result.

With some added benchmarking, we can see it's pretty quick:

```
 0.034s      26: 60
 0.040s      52: 256
 0.061s     104: 1800
 0.068s     208: 18750
 0.105s    1691: 2125764000
17.552s 1000000: 519312780448388736089589843750000000000000000000000000000000000000000000000000000000
```

**This** takes it a little longer to calculate the millionth number than our sieve took to find the 208th.  That's performance progress.

See the full solution at (https://github.com/manwar/perlweeklychallenge-club/blob/master/challenge-003/fjwhittle/perl6/ch-1.p6)

## Generating Pascal's Triangle

This took much less effort.  There's a lot of algorithms for generating Pascal's Triangle.  I chose one that allowed me to not inspect the previous row:

<figure>
  <math>
    <semantics>
      <mrow>
        <mstyle displaystyle="true" scriptlevel="0">
          <mrow><mrow><mo>(</mo></mrow>
            <mfrac linethickness="0px"><mi>n</mi><mi>k</mi></mfrac>
            <mrow><mo>)</mo></mrow>
          </mrow>
          <mo>=</mo>
          <mrow>
            <mrow><mo>(</mo></mrow>
            <mfrac linethickness="0px">
              <mi>n</mi>
              <mrow><mi>k</mi><mo>−</mo><mn>1</mn></mrow>
            </mfrac>
            <mrow><mo>)</mo></mrow>
          </mrow>
          <mo>×</mo>
          <mrow>
            <mfrac>
              <mrow><mi>n</mi><mo>+</mo><mn>1</mn><mo>−</mo><mi>k</mi></mrow>
              <mi>k</mi>
            </mfrac>
          </mrow>
        </mstyle> 
      </mrow>
    </semantics>
  </math>
</figure>

… and made it into Perl6. See (https://github.com/manwar/perlweeklychallenge-club/blob/master/challenge-003/fjwhittle/perl6/ch-2.p6), noting that the formula is 1-indexed and Perl6 is 0-indexed (except I made $n 1-indexed).
