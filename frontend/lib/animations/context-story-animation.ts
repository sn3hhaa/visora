import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ContextAnimationRefs {
  section: HTMLElement;
  pinWrapper: HTMLElement;
  introHeader: HTMLElement;
  card1: HTMLElement;
  card2: HTMLElement;
  card3: HTMLElement;
  textF1: HTMLElement;
  textH1B: HTMLElement;
  textB1B2: HTMLElement;
}

export function setupContextStoryTimeline(refs: ContextAnimationRefs) {
  gsap.registerPlugin(ScrollTrigger);

  const {
    section,
    pinWrapper,
    introHeader,
    card1,
    card2,
    card3,
    textF1,
    textH1B,
    textB1B2,
  } = refs;

  const mm = gsap.matchMedia();

  // Desktop Animation (> 768px)
  mm.add("(min-width: 768px)", () => {
    // Exact 1cm gap matching reference (~12px)
    const GAP_1CM = 12;
    const card1Height = card1.offsetHeight || 700;
    const card1HalfWidth =
      (card1.offsetHeight ? (card1.offsetHeight * (823 / 1024)) / 2 : card1.offsetWidth / 2) || 280;
    const card2HalfWidth =
      (card2.offsetHeight ? (card2.offsetHeight * (764 / 1024)) / 2 : card2.offsetWidth / 2) || 260;
    const card3HalfWidth =
      (card3.offsetHeight ? (card3.offsetHeight * (818 / 1024)) / 2 : card3.offsetWidth / 2) || 279;

    // --- Phase 1 Coordinates (Image 1 is Center 100%, Image 2 emerges on Right 50%) ---
    const x2_phase1_end = card1HalfWidth + GAP_1CM;

    // --- Phase 2 Coordinates (Image 2 is Center 100%, Image 1 is Top-Left 50%, Image 3 is Right 50%) ---
    const x1_left50 = -(card2HalfWidth + 0.50 * card1HalfWidth + GAP_1CM);
    const y1_topLeft = -card1Height * 0.50;
    const x2_center = -card2HalfWidth;
    const x3_phase2_start = 0.80 * card1HalfWidth + card2HalfWidth + 1.80 * GAP_1CM;
    const x3_phase2_end = card2HalfWidth + GAP_1CM;

    // --- Phase 3 Coordinates (Image 3 is Center 100%, Image 2 is Top-Left 50%, Image 1 shrinks into top) ---
    const x3_center = -card3HalfWidth;
    const x2_left50 = -(card3HalfWidth + card2HalfWidth + GAP_1CM);
    const y2_topLeft = -card1Height * 0.50;
    const y1_topPinned = -card1Height;

    // Initial States: All cards start minimal and invisible
    gsap.set(introHeader, {
      autoAlpha: 0,
      scale: 0.05,
      y: 0,
      transformOrigin: "center top",
    });

    gsap.set(card1, {
      autoAlpha: 0,
      scale: 0.05,
      x: 0,
      y: 0,
      transformOrigin: "center bottom",
    });

    gsap.set(card2, {
      autoAlpha: 0,
      scale: 0.05,
      x: x2_phase1_end,
      y: 0,
      transformOrigin: "left bottom",
    });

    gsap.set(card3, {
      autoAlpha: 0,
      scale: 0.05,
      x: x3_phase2_start,
      y: 0,
      transformOrigin: "left bottom",
    });

    // Query Sub-elements
    const textF1Label = (textF1.querySelector("[data-f1-label]") as HTMLElement) || textF1;
    const textF1Line = (textF1.querySelector("[data-f1-line]") as HTMLElement) || textF1;

    const textH1BLabel = (textH1B.querySelector("[data-h1b-label]") as HTMLElement) || textH1B;
    const textH1BLine = (textH1B.querySelector("[data-h1b-line]") as HTMLElement) || textH1B;

    const textB1B2Label = (textB1B2.querySelector("[data-b1b2-label]") as HTMLElement) || textB1B2;
    const textB1B2Line = (textB1B2.querySelector("[data-b1b2-line]") as HTMLElement) || textB1B2;

    // F-1 Indicator (Act 1)
    gsap.set(textF1, {
      autoAlpha: 1,
      width: card2HalfWidth,
      maxWidth: card2HalfWidth,
      x: x2_phase1_end,
      y: 0,
    });
    gsap.set(textF1Line, {
      autoAlpha: 0,
      scaleY: 0,
      x: 25,
      transformOrigin: "center center",
    });
    gsap.set(textF1Label, {
      autoAlpha: 0,
      x: 35,
    });

    // H-1B Indicator (Act 2)
    gsap.set(textH1B, {
      autoAlpha: 1,
      width: card3HalfWidth,
      maxWidth: card3HalfWidth,
      x: x3_phase2_end,
      y: 0,
    });
    gsap.set(textH1BLine, {
      autoAlpha: 0,
      scaleY: 0,
      x: 25,
      transformOrigin: "center center",
    });
    gsap.set(textH1BLabel, {
      autoAlpha: 0,
      x: 35,
    });

    // B1/B2 Indicator (Act 3)
    gsap.set(textB1B2, {
      autoAlpha: 1,
      width: card3HalfWidth,
      maxWidth: card3HalfWidth,
      x: x3_phase2_end,
      y: 0,
    });
    gsap.set(textB1B2Line, {
      autoAlpha: 0,
      scaleY: 0,
      x: 25,
      transformOrigin: "center center",
    });
    gsap.set(textB1B2Label, {
      autoAlpha: 0,
      x: 35,
    });

    // Entrance trigger starting at 15% visibility (top 85%)
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "top top",
        scrub: 0.4,
      },
    });

    entranceTl
      .to(introHeader, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, 0)
      .to(introHeader, { scale: 1.0, duration: 1.0, ease: "power1.out" }, 0);

    // Master Pinned Timeline
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: pinWrapper,
        start: "top top",
        end: "+=7800",
        scrub: 0.4,
        anticipatePin: 1,
      },
    });

    // ==========================================
    // ACT 1: Image 1 (Academic) grows to 100% full size.
    // Image 2 (Professional) emerges on the Right (50%).
    // F-1 Indicator: Maroon line enters from right first, then 01 F-1 text slides in.
    // ==========================================
    pinTl
      .to(card1, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, 0)
      .to(card1, { scale: 1.0, duration: 2.4, ease: "none" }, 0)

      .set(card2, { autoAlpha: 0, scale: 0.05, x: x2_phase1_end, y: 0 }, 0)
      .set(card3, { autoAlpha: 0, scale: 0.05, x: x3_phase2_start, y: 0 }, 0)
      .set(textF1, { autoAlpha: 1, width: card2HalfWidth, maxWidth: card2HalfWidth, x: x2_phase1_end }, 0)
      .set(textF1Line, { autoAlpha: 0, scaleY: 0, x: 25 }, 0)
      .set(textF1Label, { autoAlpha: 0, x: 35 }, 0)
      .set(textH1B, { autoAlpha: 1, width: card3HalfWidth, maxWidth: card3HalfWidth, x: x3_phase2_end }, 0)
      .set(textH1BLine, { autoAlpha: 0, scaleY: 0, x: 25 }, 0)
      .set(textH1BLabel, { autoAlpha: 0, x: 35 }, 0)
      .set(textB1B2, { autoAlpha: 1, width: card3HalfWidth, maxWidth: card3HalfWidth, x: x3_phase2_end }, 0)
      .set(textB1B2Line, { autoAlpha: 0, scaleY: 0, x: 25 }, 0)
      .set(textB1B2Label, { autoAlpha: 0, x: 35 }, 0)

      // Headline lifts upward and vanishes
      .to(
        introHeader,
        {
          y: -35,
          scale: 0.75,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.in",
        },
        1.5
      )

      // Image 2 emerges and grows from 0.05 -> 0.50 on the Right (locked 1cm gap)
      .fromTo(
        card2,
        {
          autoAlpha: 0,
          scale: 0.05,
          x: x2_phase1_end,
          y: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power1.out",
        },
        2.4
      )
      .to(
        card2,
        {
          scale: 0.50,
          x: x2_phase1_end,
          y: 0,
          duration: 1.2,
          ease: "none",
        },
        2.4
      )

      // 1. FIRST: Maroon Accent Line enters from right
      .to(
        textF1Line,
        {
          autoAlpha: 1,
          scaleY: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        2.8
      )

      // 2. SECOND: 01 F-1 VISA Text smoothly slides in from right behind it
      .to(
        textF1Label,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        3.05
      )

      // Hold Frame 1: Centerpiece 1 hold
      .to({}, { duration: 0.6 }, 3.6);

    // ==========================================
    // ACT 2: Advance to Centerpiece 2 (Professional)
    // F-1 indicator glides out to the right and fades smoothly
    // Card 1 shrinks 1.0 -> 0.50 and moves to LEFT TOP
    // Card 2 grows 0.50 -> 1.0 and moves to Center
    // Card 3 emerges directly 1cm beside Card 2 at 20% swap progress
    // H-1B Indicator: Line enters from right first, then 02 H-1B text slides in.
    // ==========================================
    const tSwap1Start = 4.2;
    const swap1Duration = 3.0;
    const tCard3Start = tSwap1Start + swap1Duration * 0.20; // 4.80s
    const card3Duration = tSwap1Start + swap1Duration - tCard3Start; // 2.40s

    pinTl
      // F-1 Indicator glides out cleanly to the right as Act 2 begins
      .to(
        [textF1Label, textF1Line],
        {
          autoAlpha: 0,
          x: 20,
          duration: 0.25,
          ease: "power2.in",
        },
        tSwap1Start
      )

      // 1. Card 1: Shifts to Left TOP and shrinks 1.0 -> 0.50
      .to(
        card1,
        {
          scale: 0.50,
          x: x1_left50,
          y: y1_topLeft,
          duration: swap1Duration,
          ease: "none",
        },
        tSwap1Start
      )

      // 2. Card 2: Shifts to Center and grows 0.50 -> 1.0 (Centerpiece 2)
      .to(
        card2,
        {
          scale: 1.0,
          x: x2_center,
          y: 0,
          duration: swap1Duration,
          ease: "none",
        },
        tSwap1Start
      )

      // 3. Card 3: Emerges from blank directly 1cm beside Card 2's right edge
      .fromTo(
        card3,
        {
          autoAlpha: 0,
          scale: 0.05,
          x: x3_phase2_start,
          y: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power1.out",
        },
        tCard3Start
      )
      .to(
        card3,
        {
          scale: 0.50,
          x: x3_phase2_end,
          y: 0,
          duration: card3Duration,
          ease: "none",
        },
        tCard3Start
      )

      // 4. H-1B Indicator: Line enters from right first
      .to(
        textH1BLine,
        {
          autoAlpha: 1,
          scaleY: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        6.2
      )

      // 5. H-1B Indicator: 02 H-1B VISA Text slides in from right second
      .to(
        textH1BLabel,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        6.45
      )

      // Hold Frame 2: Centerpiece 2 hold
      .to({}, { duration: 0.6 }, tSwap1Start + swap1Duration);

    // ==========================================
    // ACT 3: Advance to Centerpiece 3 (Visitor)
    // H-1B indicator glides out to the right and fades smoothly
    // Card 1 shrinks strictly into its top edge into 0 (never dropping down)
    // Card 2 moves from Center to Left TOP (1.0 -> 0.50)
    // Card 3 moves from Right to Center (0.50 -> 1.0)
    // B1/B2 Indicator: Line enters from right first, then 03 B1/B2 text slides in.
    // ==========================================
    const tSwap2Start = tSwap1Start + swap1Duration + 0.6; // 7.80s
    const swap2Duration = 3.0;

    pinTl
      // H-1B Indicator glides out cleanly to the right as Act 3 begins
      .to(
        [textH1BLabel, textH1BLine],
        {
          autoAlpha: 0,
          x: 20,
          duration: 0.25,
          ease: "power2.in",
        },
        tSwap2Start
      )

      // 1. Card 1: Shrinks into the top edge
      .to(
        card1,
        {
          scale: 0.0,
          y: y1_topPinned,
          autoAlpha: 0,
          duration: 0.75,
          ease: "power2.inOut",
        },
        tSwap2Start
      )

      // 2. Card 2: Shifts from Center to Left TOP and shrinks 1.0 -> 0.50
      .to(
        card2,
        {
          scale: 0.50,
          x: x2_left50,
          y: y2_topLeft,
          duration: swap2Duration,
          ease: "none",
        },
        tSwap2Start
      )

      // 3. Card 3: Shifts from Right to Center and grows 0.50 -> 1.0 (Centerpiece 3)
      .to(
        card3,
        {
          scale: 1.0,
          x: x3_center,
          y: 0,
          duration: swap2Duration,
          ease: "none",
        },
        tSwap2Start
      )

      // 4. B1/B2 Indicator: Line enters from right first
      .to(
        textB1B2Line,
        {
          autoAlpha: 1,
          scaleY: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        9.8
      )

      // 5. B1/B2 Indicator: 03 B1/B2 VISA Text slides in from right second
      .to(
        textB1B2Label,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        10.05
      )

      // Hold Frame 3: Final Centerpiece 3 hold with Card 2 at Top-Left
      .to({}, { duration: 0.8 }, tSwap2Start + swap2Duration);
  });

  // Mobile Animation (< 768px)
  mm.add("(max-width: 767px)", () => {
    const GAP_1CM = 10;
    const card1Height = card1.offsetHeight || 540;
    const card1HalfWidth =
      (card1.offsetHeight ? (card1.offsetHeight * (823 / 1024)) / 2 : card1.offsetWidth / 2) || 170;
    const card2HalfWidth =
      (card2.offsetHeight ? (card2.offsetHeight * (764 / 1024)) / 2 : card2.offsetWidth / 2) || 158;
    const card3HalfWidth =
      (card3.offsetHeight ? (card3.offsetHeight * (818 / 1024)) / 2 : card3.offsetWidth / 2) || 169;

    const mX2_phase1_end = card1HalfWidth + GAP_1CM;
    const mX1_left50 = -(card2HalfWidth + 0.50 * card1HalfWidth + GAP_1CM);
    const mY1_topLeft = -card1Height * 0.45;
    const mX2_center = -card2HalfWidth;
    const mX3_phase2_start = 0.80 * card1HalfWidth + card2HalfWidth + 1.80 * GAP_1CM;
    const mX3_phase2_end = card2HalfWidth + GAP_1CM;

    const mX3_center = -card3HalfWidth;
    const mX2_left50 = -(card3HalfWidth + card2HalfWidth + GAP_1CM);
    const mY2_topLeft = -card1Height * 0.45;
    const mY1_topPinned = -card1Height * 0.90;

    gsap.set(introHeader, {
      autoAlpha: 0,
      scale: 0.08,
      y: 0,
      transformOrigin: "center top",
    });

    gsap.set(card1, {
      autoAlpha: 0,
      scale: 0.05,
      x: 0,
      y: 0,
      transformOrigin: "center bottom",
    });

    gsap.set(card2, {
      autoAlpha: 0,
      scale: 0.05,
      x: mX2_phase1_end,
      y: 0,
      transformOrigin: "left bottom",
    });

    gsap.set(card3, {
      autoAlpha: 0,
      scale: 0.05,
      x: mX3_phase2_start,
      y: 0,
      transformOrigin: "left bottom",
    });

    const mTextF1Label = (textF1.querySelector("[data-f1-label]") as HTMLElement) || textF1;
    const mTextF1Line = (textF1.querySelector("[data-f1-line]") as HTMLElement) || textF1;

    const mTextH1BLabel = (textH1B.querySelector("[data-h1b-label]") as HTMLElement) || textH1B;
    const mTextH1BLine = (textH1B.querySelector("[data-h1b-line]") as HTMLElement) || textH1B;

    const mTextB1B2Label = (textB1B2.querySelector("[data-b1b2-label]") as HTMLElement) || textB1B2;
    const mTextB1B2Line = (textB1B2.querySelector("[data-b1b2-line]") as HTMLElement) || textB1B2;

    // F-1
    gsap.set(textF1, {
      autoAlpha: 1,
      width: card2HalfWidth,
      maxWidth: card2HalfWidth,
      x: mX2_phase1_end,
      y: 0,
    });
    gsap.set(mTextF1Line, {
      autoAlpha: 0,
      scaleY: 0,
      x: 20,
      transformOrigin: "center center",
    });
    gsap.set(mTextF1Label, {
      autoAlpha: 0,
      x: 25,
    });

    // H-1B
    gsap.set(textH1B, {
      autoAlpha: 1,
      width: card3HalfWidth,
      maxWidth: card3HalfWidth,
      x: mX3_phase2_end,
      y: 0,
    });
    gsap.set(mTextH1BLine, {
      autoAlpha: 0,
      scaleY: 0,
      x: 20,
      transformOrigin: "center center",
    });
    gsap.set(mTextH1BLabel, {
      autoAlpha: 0,
      x: 25,
    });

    // B1/B2
    gsap.set(textB1B2, {
      autoAlpha: 1,
      width: card3HalfWidth,
      maxWidth: card3HalfWidth,
      x: mX3_phase2_end,
      y: 0,
    });
    gsap.set(mTextB1B2Line, {
      autoAlpha: 0,
      scaleY: 0,
      x: 20,
      transformOrigin: "center center",
    });
    gsap.set(mTextB1B2Label, {
      autoAlpha: 0,
      x: 25,
    });

    const mEntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "top top",
        scrub: 0.4,
      },
    });

    mEntranceTl
      .to(introHeader, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, 0)
      .to(introHeader, { scale: 1.0, duration: 1.0, ease: "power1.out" }, 0);

    const mPinTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: pinWrapper,
        start: "top top",
        end: "+=6600",
        scrub: 0.4,
        anticipatePin: 1,
      },
    });

    // Act 1
    mPinTl
      .to(card1, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, 0)
      .to(card1, { scale: 1.0, duration: 2.2, ease: "none" }, 0)
      .set(card2, { autoAlpha: 0, scale: 0.05, x: mX2_phase1_end, y: 0 }, 0)
      .set(card3, { autoAlpha: 0, scale: 0.05, x: mX3_phase2_start, y: 0 }, 0)
      .set(textF1, { autoAlpha: 1, width: card2HalfWidth, maxWidth: card2HalfWidth, x: mX2_phase1_end }, 0)
      .set(mTextF1Line, { autoAlpha: 0, scaleY: 0, x: 20 }, 0)
      .set(mTextF1Label, { autoAlpha: 0, x: 25 }, 0)
      .set(textH1B, { autoAlpha: 1, width: card3HalfWidth, maxWidth: card3HalfWidth, x: mX3_phase2_end }, 0)
      .set(mTextH1BLine, { autoAlpha: 0, scaleY: 0, x: 20 }, 0)
      .set(mTextH1BLabel, { autoAlpha: 0, x: 25 }, 0)
      .set(textB1B2, { autoAlpha: 1, width: card3HalfWidth, maxWidth: card3HalfWidth, x: mX3_phase2_end }, 0)
      .set(mTextB1B2Line, { autoAlpha: 0, scaleY: 0, x: 20 }, 0)
      .set(mTextB1B2Label, { autoAlpha: 0, x: 25 }, 0)
      .to(
        introHeader,
        {
          y: -25,
          scale: 0.75,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.in",
        },
        1.3
      )
      .fromTo(
        card2,
        {
          autoAlpha: 0,
          scale: 0.05,
          x: mX2_phase1_end,
          y: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power1.out",
        },
        2.2
      )
      .to(
        card2,
        {
          scale: 0.50,
          x: mX2_phase1_end,
          y: 0,
          duration: 1.0,
          ease: "none",
        },
        2.2
      )
      // Line from right
      .to(
        mTextF1Line,
        {
          autoAlpha: 1,
          scaleY: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        2.5
      )
      // Text from right
      .to(
        mTextF1Label,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        2.7
      )
      .to({}, { duration: 0.5 }, 3.2);

    // Act 2
    const mtSwap1Start = 3.7;
    const mSwap1Duration = 2.6;
    const mtCard3Start = mtSwap1Start + mSwap1Duration * 0.20;
    const mCard3Duration = mtSwap1Start + mSwap1Duration - mtCard3Start;

    mPinTl
      .to(
        [mTextF1Label, mTextF1Line],
        {
          autoAlpha: 0,
          x: 15,
          duration: 0.2,
          ease: "power2.in",
        },
        mtSwap1Start
      )
      .to(
        card1,
        {
          scale: 0.50,
          x: mX1_left50,
          y: mY1_topLeft,
          duration: mSwap1Duration,
          ease: "none",
        },
        mtSwap1Start
      )
      .to(
        card2,
        {
          scale: 1.0,
          x: mX2_center,
          y: 0,
          duration: mSwap1Duration,
          ease: "none",
        },
        mtSwap1Start
      )
      .fromTo(
        card3,
        {
          autoAlpha: 0,
          scale: 0.05,
          x: mX3_phase2_start,
          y: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power1.out",
        },
        mtCard3Start
      )
      .to(
        card3,
        {
          scale: 0.50,
          x: mX3_phase2_end,
          y: 0,
          duration: mCard3Duration,
          ease: "none",
        },
        mtCard3Start
      )
      // H-1B Line from right
      .to(
        mTextH1BLine,
        {
          autoAlpha: 1,
          scaleY: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        5.5
      )
      // H-1B Text from right
      .to(
        mTextH1BLabel,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        5.7
      )
      .to({}, { duration: 0.5 }, mtSwap1Start + mSwap1Duration);

    // Act 3
    const mtSwap2Start = mtSwap1Start + mSwap1Duration + 0.5; // 6.80s
    const mSwap2Duration = 2.6;

    mPinTl
      .to(
        [mTextH1BLabel, mTextH1BLine],
        {
          autoAlpha: 0,
          x: 15,
          duration: 0.2,
          ease: "power2.in",
        },
        mtSwap2Start
      )
      .to(
        card1,
        {
          scale: 0.0,
          y: mY1_topPinned,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        },
        mtSwap2Start
      )
      .to(
        card2,
        {
          scale: 0.50,
          x: mX2_left50,
          y: mY2_topLeft,
          duration: mSwap2Duration,
          ease: "none",
        },
        mtSwap2Start
      )
      .to(
        card3,
        {
          scale: 1.0,
          x: mX3_center,
          y: 0,
          duration: mSwap2Duration,
          ease: "none",
        },
        mtSwap2Start
      )
      // B1/B2 Line from right
      .to(
        mTextB1B2Line,
        {
          autoAlpha: 1,
          scaleY: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        8.6
      )
      // B1/B2 Text from right
      .to(
        mTextB1B2Label,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        8.8
      )
      .to({}, { duration: 0.6 }, mtSwap2Start + mSwap2Duration);
  });

  return () => mm.revert();
}

