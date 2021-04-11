# Coral
This is a weekend-project I did in a few hours total and I'm very happy how it turned out, to be honest. I am very surprised, how well it works and find it extremely mesmerizing to watch.


## What It's For
Since I find it very interesting to watch I'll properly use it as my background or screensaver.
Originally I just wanted to play around. Over the hours it progressed, worked really well and I created something Coral-Reef ’isch.
[watch live](https://jason-rietzke.github.io/coral/index.html)
-->embed video<--

By playing with some filter I found that a blur effect feels very smooth and mesmerizing as the paths move. For me it's more like a Lava-Lamp.
[watch live](https://jason-rietzke.github.io/coral/blured.html)
-->embed video<--


## How It Works
To accomplish this result I used a HTML-Canvas to draw the paths and tasked the AnimationFrame to perform the calculations. That's necessary since we have to calculate round about 100.000 paths per second.

#### Attributes
To get this random but natural look I broke the attributes of each path in separate noise layers.
Attribute | Description
-- | --
Length | this noise-layer is responsible for the length of each path at it's position. Used are only values greater 0 (in a rage from -1 to 1) so we get these nice bubbles
Rotation | this noise-layer controls the rotation of each path. Since it reaches from -1 to 1 it gets used as the radiant and we get a full 360 degree
Colors R,G,B | red, green and blue do have separate noise-layers. By overlapping they create further colors. For aesthetics I cut them if their value is smaller than 64 and it gets replaced by a gray.

#### Movement
The seamless movement of all the attributes is done by creating for every noise-layer their own offset parameter and movement vector. This way all layers shift themselves into different directions and combining all of them results in a very random but still natural feeling motion.


## What's Next
Currently I implemented the basic features so it looks good, but I'll probably put some more work into it.
I made two demo-version available on GitHub Pages - the "normal" (Coral-Reef) one and blurred (Lava-Lamp) one
* [normal](https://jason-rietzke.github.io/coral/index.html)
* [blured](https://jason-rietzke.github.io/coral/blured.html)
