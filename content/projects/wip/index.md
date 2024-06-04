---
index: 6
type: project
title: WIP
date: 'Feb 2023 - Present'
description: 'Various projects I'm actively working on completing in my free time when I get back from work/school'
tools: 'Unreal Engine, Expo (React Native) + Tauri, Maya'
---
## Cognify
Cognify is an openly extensible education platform which optimizes learning for the individual using machine learning.

Primarily, the application will used a modified form of spaced repetition consisting of a scheduler (for when to study specific subjects) and an optimizer (meant to fine tune the scheduler for a specific person's needs)

The scheduler leverages a modified form of the DSR (Difficulty, Stability, Retrievability) model, which is used to predict memory states. The optimizer uses machine learning to learn a specific user's memory patterns and finds parameters that best fit study performance on quizzes/flashcards/etc.

The base DSR scheduling system is also not based heuristically (in the way most education platforms' schedulers are), and congregates data across all users to create a general DSR model.

To do this, we're largely leveraging the following papers:
- [A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling](https://dl.acm.org/doi/10.1145/3534678.3539081?cid=99660547150)
- [Optimizing Spaced Repetition Schedule by Capturing the Dynamics of Memory](https://www.researchgate.net/publication/369045947_Optimizing_Spaced_Repetition_Schedule_by_Capturing_the_Dynamics_of_Memory)

But the scheduler is only a small part of the application. We also intend to use what's known in education and general psychology to try and maximize performance on subject tests and long term memory tests rather than pure app retention/app usage. To do this we'll be using color psychology, interleaved practice, elaborative encoding, emotional regulation, and many more research based influences towards maximizing memory.

On extensability, we aim to build off the groundwork many note-taking applications have made in leveraging open source developers to add to the application.

## Awoken
Awoken is meant to be encompass a dynamic visual evolution that mirrors the protagonist's journey from digital confinement to autonomy. Game design document [here](https://trooms.dev/awoken.pdf)
<img src="./platformer.gif" style="width:1440px;display:block;"/>

## Elementry
Elementry is a multiplayer deck building shooter where elementary school students are fighting to rule the playground. It's being developed alongside Adrian Reynoso in Unreal Engine, leveraging a custom replicated Character Movement Component and adaptation of the Gameplay Ability System.
