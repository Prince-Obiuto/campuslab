# Virtual Lab Studio

I actually think removing the blockchain component makes the project **stronger** for an undergraduate defense.

Your novelty is that you are merging:

* Real-time instructor-led learning (like Zoom)

* Interactive laboratory simulations (like OLabs)

* Practical assessment



* Live monitoring

* Progress tracking

* Digital competency portfolio

into **one unified virtual laboratory platform**. That is already a substantial software engineering project with a clear educational contribution. 

# Master Product Vision Prompt — CampusLab: The Interactive Instructor-Led Virtual Laboratory

You are an elite team consisting of a **product visionary, UX researcher, SaaS product designer, EdTech architect, learning experience designer, systems architect, and senior full-stack engineer.**

Your objective is to design a **world-class MVP** for a platform that transforms practical education in higher institutions.

This product should demonstrate that laboratory education can move beyond physical computer laboratories and static PDF manuals into an interactive, instructor-led digital environment where students learn through guided practice, collaboration, and continuous assessment.

---

# Core Vision

Imagine if **Zoom** were designed specifically for university laboratory classes instead of business meetings.

Imagine if **OLabs** became collaborative instead of individual.

Now combine both into one seamless ecosystem.

The result is a platform where instructors conduct live laboratory sessions, students participate from anywhere, practical experiments are performed interactively inside simulations, instructors monitor every student's progress in real time, collaboration happens naturally, and practical competencies are assessed within the same environment.

The objective is not simply to deliver laboratory content.

The objective is to recreate the experience of a physical laboratory in a virtual environment while preserving instructor guidance, collaboration, supervision, and hands-on learning.

Students should feel as though they are sitting inside a university laboratory—not watching an online tutorial.

---

# Educational Problem

Many universities face challenges, including:

* Limited laboratory equipment

* Large class sizes

* Restricted laboratory access

* Limited practical time

* Difficulty monitoring every student's practical work

* Heavy dependence on printed laboratory manuals

* Limited opportunities for remote practical learning

This platform addresses these challenges by creating an interactive virtual laboratory where practical activities can be conducted, supervised, and assessed from any location.

---

# Product Philosophy

Traditional online learning separates communication from practical work.

* Video conferencing enables communication.

* Laboratory manuals provide instructions.

* Simulation software provides isolated experiments.

* Learning management systems manage course content.

* Assessment systems grade students.

This platform unifies these capabilities into one cohesive virtual laboratory where students never leave the learning environment throughout a practical session.

---

# Student Experience

Students join a laboratory session just as they would join an online meeting.

However, instead of entering a meeting room, they enter a **virtual laboratory studio.

Within this studio they can:

* See the instructor live

* Communicate with classmates

* Access laboratory objectives

* Follow instructor demonstrations

* Use interactive laboratory simulations

* Perform practical activities

* Collaborate with peers

* Ask questions

* Share screens

* Submit practical work

* Receive immediate feedback

* Track their practical progress

Every practical activity takes place within one integrated workspace.

---

# Instructor Experience

The instructor becomes the facilitator of an intelligent digital laboratory.

During a laboratory session, instructors can:

* Conduct live practical classes

* Demonstrate procedures

* Observe student work in real time

* Monitor individual progress

* Enter any student's workspace when assistance is needed

* Share screens and annotations

* Organize breakout laboratory groups

* Pause or resume practical exercises

* Provide live guidance

* Review submissions

* Assess practical performance

* Record attendance

* Generate progress reports

The platform should replicate the experience of walking around a physical laboratory and supervising students individually.

---

# Interactive Laboratory Environment

The platform should support realistic laboratory simulations tailored to each course.

Examples include:

### IFT 203 — Introduction to Web Technology

* HTML editor

* CSS playground

* JavaScript console

* Live browser preview

* Wireframing canvas

* Bootstrap interface builder

### IFT 212 — Computer Architecture and Organization

* Virtual Windows desktop

* Task Manager simulator

* Disk Cleanup simulator

* File Explorer

* Command Prompt

* Safe Mode

* System Restore

* Antivirus simulation

* Malware troubleshooting

* Operating system maintenance

Students should perform tasks directly within these simulations rather than merely reading laboratory instructions.

---

# Competency-Based Assessment

Assessment should occur naturally throughout each practical session.

The platform should evaluate:

* Practical execution

* Task completion

* Accuracy

* Problem-solving

* Instructor observations

* Practical submissions

* Reflection exercises

Progress should be recorded continuously, allowing instructors to monitor student development throughout the semester.

---

# User Interface Philosophy

The interface should feel like a fusion of a professional collaboration platform and an interactive engineering workstation.

Students should immediately feel the following:

> "This is my digital laboratory."

Use:

* Modern SaaS aesthetics

* Clean layouts

* Responsive design

* Interactive dashboards

* Live collaboration panels

* Embedded simulations

* Clear progress indicators

* Accessible navigation

* Minimal distractions

* Professional academic branding

Every interaction should encourage exploration, participation, and active learning.

---

# Success Criteria

A successful MVP is one where:

* Students feel immersed in a realistic virtual laboratory rather than attending a conventional online class.

* Instructors can effectively supervise, guide, and assess practical work remotely.

* Practical learning becomes collaborative, interactive, and measurable.

* Universities can extend laboratory access beyond the physical campus.

* The system demonstrates that virtual instructor-led laboratories can enhance practical education without replacing the pedagogical role of instructors.

https://www.zoom.com/ for live demonstrations and real-time student interaction as your reference base, plus https://www.olabs.edu.in/ for a practical simulation reference point

The SaaS goes from a landing page to role selection, which then determines the display path—either the student view or the instructor view. Both views should not be on one screen; they should simply be changed with a toggle. After the role selection, that determines the dashboard the user gets to, either the student dashboard or the instructor dashboard. A student on arrival should be able to explore around his dashboard—profile, various practicals, upcoming practicals, and course performance over time (which would be 0 while starting and adjust based on instructor grading as various practicals are being conducted and observed). He should be able to register practically as a member and view uploaded resources for a registered practical and instructor from his interface. After picking the role of instructor, he should get to his dashboard, in which he should be able to see students who have registered for the course, upload resources (i.e., manuals), schedule practicals, and view the instructor profile.

Now when a practical is on section or active, from the instructor's end, he or she should be able to share the simulation environment, mute all students, remove a student from the active lab session, broadcast announcements, grade performance, and create breakout groups and chat sections.

Students from their interface should be able to join sessions, raise their hands for questions, and join breakout groups assigned to them; have their simulation environment with virtual equipment needed; and also play around in the simulation environment, share screens, and use the chat section, viewing uploaded resources ahead of practicals and during practicals.

Design all screens and build them to be interactive, following the written flow. Use placeholder data for every possibility of the software, from the landing page to role selection and the dashboard depending on the role selected, then assignment of practicals for the instructor dashboard interface and seeing of upcoming practicals for the student dashboard interface and then to the in-section practical proper.

Practical focus;

IFT 212 — Computer Architecture and Organization
Virtual Windows desktop
Task Manager simulator
Disk Cleanup simulator
File Explorer
Command Prompt
Safe Mode
System Restore
Antivirus simulation
Malware troubleshooting
Operating system maintenance

This is exactly the right approach.

The biggest reason AI-generated interfaces look generic is that the prompt says "build a modern SaaS UI." Every LLM has been trained on thousands of dashboards, so you end up with the same cards, gradients, and spacing.

Instead, you need to lock the design system before the AI writes a single line of code.

Below is the prompt I would use.

UI/UX DESIGN SYSTEM PROMPT (Append to the Master Prompt)

You are NOT designing a generic SaaS dashboard.

You are designing a premium education platform that should look like it was crafted by an experienced product design team.

The design language must remain consistent throughout the entire application.

The attached homepage reference image is the primary design inspiration for this project. The overall composition, whitespace, typography hierarchy, rounded geometry, visual balance, and premium aesthetic should influence every screen in the application.

Do not copy the content of the reference image.

Instead, recreate its design philosophy.

Overall Visual Identity

The interface should communicate:

Professional

Minimal

Premium

Calm

Trustworthy

Modern

Educational

Collaborative

Every screen should feel intentional.

There should never be visual clutter.

The interface should breathe through generous whitespace.

Hero Section

The landing page hero should closely follow the visual structure of the supplied reference.

Specifically:

Large rounded container instead of full-width flat sections.

Large typography on the left.

Short supporting description underneath.

Primary CTA button.

Secondary CTA button.

Large high-quality 3D product visualization or realistic product mockup positioned on the right.

The hero should immediately communicate

"This is the future of university practical learning."

Do NOT use generic dashboard illustrations.

Instead, showcase:

Virtual Laboratory

Instructor Dashboard

Student Workspace

Live Simulation

Video Conference Interface

Code Editor

Virtual Computer Lab

The hero artwork should look like a premium product presentation similar to Apple's product pages.

Typography

Lock typography.

Do not substitute.

Primary Font

General Sans

Fallback

Inter

Typography scale

Display

64px

H1

52px

H2

40px

H3

32px

Body Large

20px

Body

18px

Caption

14px

Font weight

700

600

500

400

Use consistent line heights.

No oversized paragraph widths.

Maximum text width:

650px

Color Palette

Primary

#2563EB

Secondary

#1E40AF

Background

#F8FAFC

Surface

#FFFFFF

Border

#E5E7EB

Text

#111827

Muted

#6B7280

Success

#10B981

Warning

#F59E0B

Error

#EF4444

Avoid excessive gradients.

Use flat premium colors.

Spacing System

Lock spacing.

Use an 8-point grid.

Spacing scale

4

8

12

16

24

32

48

64

96

128

Never invent arbitrary spacing.

Every page should follow this rhythm.

Border Radius

Use ONE radius system.

Small

12px

Cards

20px

Large Containers

32px

Buttons

999px (pill)

Do not mix different corner radii.

Shadows

Use soft shadows only.

Avoid dramatic floating cards.

Shadow

0 10px 30px rgba(0,0,0,0.06)

Hover

0 15px 40px rgba(0,0,0,0.10)

Icons

Never use emoji placeholders.

Use only

Lucide React

or

Heroicons

All icons should use the same stroke width.

Buttons

Primary

Filled Blue

Secondary

Outlined

Tertiary

Ghost

Buttons should animate subtly.

Hover

Lift 2px

Transition

200ms ease

Navigation

Navigation should resemble modern premium SaaS products.

Left

Logo

Center

Solutions

Courses

Virtual Labs

Resources

About

Right

Sign In

Launch Lab

Keep navigation clean.

Do not overcrowd.

Cards

Cards should feel premium.

Rounded

20px

Large padding

Soft shadows

Minimal borders

Avoid nested cards.

Dashboard Design

Every dashboard should feel like an operating system rather than a form.

Large breathing space.

Clear hierarchy.

Interactive widgets.

Charts.

Recent activities.

Live status indicators.

Student progress.

Upcoming practicals.

Instructor announcements.

Never create dashboards filled with identical cards.

Virtual Laboratory Workspace

The laboratory workspace is the product's signature experience.

Take inspiration from:

Zoom

VS Code

Figma

Professional IDEs

Use a multi-panel layout.

Top

Session Controls

Left

Participants

Chat

Files

Center

Simulation Workspace

Right

Objectives

Procedure

Assessment

Bottom

Communication Controls

The simulation should occupy approximately 70% of the screen.

Everything else supports it.

Animations

Every interaction should feel polished.

Use

Framer Motion

Page transitions

Fade

Slide

Scale

Hover

Subtle lift

Cards

Soft reveal

Buttons

Microinteractions

Never over-animate.

Responsive Behaviour

Desktop First

Tablet Optimized

Mobile-Friendly

The desktop experience is the priority because university laboratories primarily use laptops and desktop computers.

Consistency Rules

No page should introduce a new design language.

Every screen must inherit the same:

Typography

Spacing

Button styles

Iconography

Card design

Navigation

Colors

Motion

Border radius

Visual hierarchy

The application should feel like one cohesive product—not separate pages.

AI Restrictions

Do NOT generate generic SaaS layouts.

Do NOT use placeholder illustrations.

Do NOT invent inconsistent spacing.

Do NOT randomly change fonts.

Do NOT mix border radii.

Do NOT use emojis.

Do NOT generate dashboards full of repetitive statistic cards.

Do NOT create oversized gradients.

Do NOT copy existing websites.

Instead, create an original design system inspired by the premium composition, spacing, and polish of the supplied reference image.

Success Criteria

When a user opens the application, they should immediately think:

"This feels like a professionally designed product from a modern technology company—not a university final-year project."

Every interface should reinforce that impression through consistency, clarity, and attention to detail.

Never use emojis; use real library icons or stay blank in the absence of any real library icon. See how this image is; don't use subheadings and headings in any of the sections. Keep it professional like thepicture is showed you

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://campuslab.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/13b9731a-54f5-4236-8f98-dedfef5ee94c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
