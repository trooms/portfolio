---
index: 4
type: project
title: Tumbleweed
date: 'Aug. 2022 - Dec. 2022 | Prototype'
description: 'Movement Based First Person Shooter'
tools: 'Unity Universal Rendering Pipeline'
---
Project started in a game design class. Most complex game I've worked on so far, despite it being a prototype. Created the entire first-person controller from scratch and implemented physics based shooting with drag. The FPS controller is able to wall jump, slide, and lean.

The scope of the game is a bit out of reach for me to do alone. I intended the R (or North on controller) button to not be a reload, and the game to not be a traditional FPS (although you will find out that it is already a bit nontraditional, even understanding the controls). Instead, players would have a deck of cards where each card is a special weapon, and pressing R (or running out of ammo) would switch to that weapon.

In the original prototype, local split screen co-op is supported. It also supports controller and keyboard (though I haven't had the opportunity to test controller support through the WebGL build below).

Honestly think this project has legs given enough time / a team. Me and some friends enjoyed it as much a lot more than other FPS games when playing split screen on the TV, it's a genre that's became a bit stale. The co-op gameplay was very fast paced and although the diversity in guns wasn't much, it provided enough stimulation to make the game more enjoyable than it would seem.

Music by Stephon Brown
Level Design by Thia Broido

### Instructions
This game is meant for more seasoned FPS players, as it does not have a fleshed out tutorial.

#### Basic Movement
- Move around with WASD and look around with your mouse
- Jump around with space; you can jump towards a wall and if you jump at the right time can wall jump (or sort of climb) the wall

#### Advanced Movement
- Sprint with shift
- Crouch with C; if you crouch while sprinting, you will slide
- Lean with Q/E

#### Misc
- Switch weapons with R (it has a cooldown, this was intended to be a feature not a bug! but it is not fleshed out)

#### NOTE
As a web build it is TERRIBLY OPTIMIZED to run purely on CPU via WASM. There is significant delay; this demo is truly here to be a demo. Oh, and you might have to alt+tab to escape out of the game (or CMD+tab on mac)

<iframe src="https://i.simmer.io/@trooms/tumbleweed" style="width:960px;height:600px"></iframe>

## Trailer
Here is some actual gameplay and a trailer we made for a games class at usc
<iframe width="420" height="315"
src="https://www.youtube.com/embed/hmuE7-T4zCE?autoplay=1&mute=1&loop=1&controls=0">
</iframe>




