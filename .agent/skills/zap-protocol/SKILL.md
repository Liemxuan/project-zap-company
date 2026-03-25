---
name: Zap Dev Wrapper Protocol
description: The rigorous standard for deep component tracking and "All-The-Way-Down" element tagging in the ZAP Design Engine.
---

# Zap Dev Wrapper Protocol: Zero-Laziness Doctrine

## Core Philosophy

The Zap Dev Wrapper Protocol is not just about tracking major components. It is the absolute, non-negotiable standard for maintaining visibility into *every structural and interactive element* within the ZAP ecosystem.

This is the **"All-The-Way-Down"** mandate. We don't just wrap the organism; we wrap the cells. We don't just wrap the section; we wrap the covers, the text, the buttons, the tags, and the lists.

## The Problem With "Lazy Wrapping"

During the Swarm integration tests (Wave 6 - Email/Input/Navigation Molecule phase), we observed a critical failure pattern among external agents: **Lazy Wrapping**.

* Agents would correctly wrap the outermost container of a molecule or section.
* They would *fail* to wrap the internal elements that give that container shape and meaning (e.g., the title, the description paragraphs, individual buttons, the "covers", metadata tags).
* **Result:** A false sense of coverage. The layout appears tracked at a high level, but the fine details remain invisible to the Inspector and Dev Mode.

## The Solution: Explicit Over Implicit

### 1. Section Covers Must Be Explicit

Do not assume a section wrapper covers the container inside it. **Every independent, meaningful visual structure must have its own identity.**

* **BAD:** Wrapping just `<Section>` and ignoring the `<div>` inside that holds the actual section content.
* **GOOD:** Wrapping the outer container with a high-level label, and wrapping the inner content block with an explicit `Cover` label (e.g., `Email Body Cover`, `Subject & Metadata Cover`).

### 2. Interaction Points Are Targets

Every button, every link, every toggle must be tracked.

* **Required:** Navigating to an Action Bar? Every individual button inside (Reply, Forward, Archive) gets wrapped.

### 3. Text and Descriptors Need Boundaries

Text without boundaries breaks Dev Mode grid visualization. You cannot wrap a `p` tag without ensuring its physical bounding box makes sense.

* **Fix:** When wrapping textual content, specifically paragraphs, always apply `w-fit inline-block` (or similar constraints) to the Wrapper itself so the tag hugs the content.
* *Why?* Without it, inline text wrappers will default to block rendering under the hood, expanding the Dev Mode bounding box to 100% width and fracturing the visual grid.

### 4. Inspector Sidebars Are Organisms, Not Black Boxes

The Inspector sidebar itself must be audited with the same rigor as the core layout.

* **Requirement:** It is not enough to wrap the `<Inspector>`. You must drill down and wrap:
  * The Technical Specs Header
  * The individual data rows (`Spec Key`, `Spec Value`)
  * The logic descriptions and toggles.
  * The Security Policy blocks.

## The Blueprint for Verification (Swarm / Claude Handoff)

When auditing or building under the ZAP Protocol, ask the following questions:

1. **Is the Shell wrapped?** (Does the major section have a wrapper?)
2. **Is the Cover wrapped?** (Does the background/card container holding the elements have its own wrapper?)
3. **Are the Atoms wrapped?** (Are the titles, paragraphs, and list items tagged individually?)
4. **Are the Actors wrapped?** (Is every button and interactive toggle tagged?)
5. **Is the Bounding Box legitimate?** (Did a text wrapper just fracture a flex container or overflow a width constraint?)

If the answer to any of these is no, the job is not done. Go back and wrap it. Zero laziness. All the way down.
