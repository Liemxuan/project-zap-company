'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { TypographyThemeSchema } from './schema';

interface TypographyWildPreviewProps {
    themeData: TypographyThemeSchema;
}

export const TypographyWildPreview = ({ themeData }: TypographyWildPreviewProps) => {
    const theme = themeData.id;
    const h1Effects = themeData.elements.h1?.effects;
    const tilt = h1Effects?.kineticTilt ?? 0;
    const shadowOffset = themeData.elements.h1?.layer2?.x ?? 0;
    const letterSpacing = h1Effects?.characterCrush ?? 0;
    const lineHeight = 1.2;
    const fontFamily = themeData.global.primaryFont;

    // FUN MODE Preview
    if (theme === 'fun') {
        return (
            <Wrapper identity={{ displayName: "Fun Mode Preview", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Atom/View" }} className="w-full">
                <div className="w-full relative h-[600px] bg-pink-100 border-[length:var(--card-border-width,4px)] border-brand-midnight overflow-hidden rounded-[2rem] shadow-[8px_8px_0px_0px_var(--color-brand-midnight)] font-display text-transform-primary flex items-center justify-center p-12">
                    <div className="absolute top-8 left-8 border-[length:var(--card-border-width,4px)] border-brand-midnight w-24 h-24 rounded-full flex items-center justify-center font-display text-transform-primary text-4xl rotate-12 bg-cyan-400 z-20 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">?!</div>
                    <div className="absolute bottom-8 right-8 bg-rose-500 text-white font-display text-transform-primary px-4 py-2 border-[length:var(--card-border-width,4px)] border-brand-midnight -rotate-12 rounded-full z-20 text-xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">WOW!</div>

                    <div className="absolute top-1/4 right-1/4 w-64 h-32 bg-[#00ffff] rounded-full opacity-60 mix-blend-multiply blur-md -rotate-12 pointer-events-none"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-brand-yellow rounded-full opacity-60 mix-blend-multiply blur-md rotate-45 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-[#ff007f] rounded-full opacity-40 mix-blend-multiply blur-lg pointer-events-none"></div>

                    <div className={`relative w-full max-w-4xl flex flex-col items-center justify-center text-center z-10 [line-height:${lineHeight}]`}>
                        <Wrapper identity={{ displayName: "Bouncy Label", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }}>
                            <div className={`bg-white border-[length:var(--card-border-width,4px)] border-brand-midnight rounded-full px-8 py-2 mb-8 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-transform [transform:rotate(${3 + tilt}deg)]`}>
 <span className={`font-display text-transform-primary font-black text-2xl text-brand-midnight [letter-spacing:${0.2 + letterSpacing / 10}em]`}>Super Bouncy</span>
                            </div>
                        </Wrapper>

                        <Wrapper identity={{ displayName: "Make It Pop Title", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }}>
                            <h2 className={`text-[140px] font-display text-transform-primary leading-[0.8] mb-16 relative transition-all duration-300 group [letter-spacing:${0.02 + letterSpacing / 10}em]`}>
                                <span className={`block text-rose-500 hover:rotate-2 transition-transform cursor-default [transform:rotate(${-6 + tilt}deg)] [-webkit-text-stroke:4px_var(--color-brand-midnight)] [text-shadow:${8 + shadowOffset}px_${8 + shadowOffset}px_0px_var(--color-brand-midnight)]`}>MAKE</span>
                                <span className={`block relative z-10 text-cyan-400 ml-12 hover:-rotate-2 transition-transform cursor-default [transform:rotate(${6 + tilt}deg)] [-webkit-text-stroke:4px_var(--color-brand-midnight)] [text-shadow:${8 + shadowOffset}px_${8 + shadowOffset}px_0px_var(--color-brand-midnight),_${16 + shadowOffset * 2}px_${16 + shadowOffset * 2}px_0px_var(--color-rose-500)]`}>IT POP</span>
                            </h2>
                        </Wrapper>

                        <Wrapper identity={{ displayName: "Playground Banner", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }}>
                            <div className={`bg-brand-yellow text-brand-midnight px-8 py-6 border-[length:var(--card-border-width,4px)] border-brand-midnight rounded-3xl -mt-12 w-4/5 mx-auto relative z-20 hover:scale-105 transition-all font-sans [transform:rotate(${-4 + tilt}deg)] [box-shadow:${8 + shadowOffset}px_${8 + shadowOffset}px_0_0_var(--color-brand-midnight)]`}>
                                <p className="font-display text-transform-primary text-3xl tracking-tight leading-tight">
                                    Typography is a playground. Jump in!
                                </p>
                            </div>
                        </Wrapper>

                        <Wrapper identity={{ displayName: "Fun Decal", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }} className="absolute -left-12 top-1/2 -mt-4">
                            <div className="bg-brand-midnight text-white font-display text-transform-primary px-4 py-2 border-[length:var(--card-border-width,4px)] border-white rounded-full -rotate-90 z-30 text-lg drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">FUN!</div>
                        </Wrapper>
                        <Wrapper identity={{ displayName: "Yeah Decal", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }} className="absolute -right-4 top-1/3 -mt-4">
                            <div className="bg-lime-400 text-brand-midnight font-display text-transform-primary px-3 py-1 border-[length:var(--card-border-width,4px)] border-brand-midnight rounded-full rotate-45 z-30 text-xl shadow-[4px_4px_0_0_var(--color-brand-midnight)]">YEAH!</div>
                        </Wrapper>
                    </div>
                </div>
            </Wrapper>
        );
    }

    // Marquee content repeated for seamless looping
    const marqueeContent = "DESTROY // REBUILD // ERROR // OVERFLOW // CHAOS // ALIGN // ";
    const repeatedMarquee = marqueeContent.repeat(4);

    return (
        <Wrapper identity={{ displayName: "Wild Mode Preview", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Atom/View" }} className="w-full">
            <div className="w-full relative h-[600px] bg-layer-cover border-[length:var(--card-border-width,2px)] border-card-border overflow-hidden rounded-card selection:bg-brand-midnight selection:text-brand-cover font-display text-transform-primary flex flex-col pt-8">


                {/* Background Blur Meshes */}
                <div className="absolute top-[30%] left-[10%] w-64 h-64 bg-green-600/60 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>
                <div className="absolute top-[40%] right-[15%] w-56 h-56 bg-orange-600/60 rounded-full blur-[60px] pointer-events-none mix-blend-multiply"></div>

                {/* Sticky "Sticker" element */}
                <Wrapper identity={{ displayName: "Exclamation Sticker", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }} className="absolute top-8 left-8 z-20">
                    <motion.div
                        className="w-16 h-16 bg-white border-[length:var(--card-border-width,2px)] border-brand-midnight rounded-card flex items-center justify-center shadow-card"
                        initial={{ rotate: -15, scale: 0.8 }}
                        animate={{ rotate: -15, scale: 1 }}
                        whileHover={{ rotate: -5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <span className="text-3xl font-display text-brand-midnight text-transform-primary">!</span>
                    </motion.div>
                </Wrapper>

                {/* Center Chaos Title Group */}
                <motion.div
                    className={`${fontFamily ? `[font-family:'${fontFamily.split(',')[0]}',sans-serif]` : ''}`}
                >

                    {/* 3D Stacked Title */}
                    <Wrapper identity={{ displayName: "3D Stacked Title", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }}>
                        <div className="relative group perspective-1000">
                            <motion.h1
                                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                                className="text-8xl md:text-[140px] font-display text-transform-primary tracking-tighter leading-[0.8]"
                            >
                                <span className="block text-white [-webkit-text-stroke:3px_var(--color-brand-midnight)] [text-shadow:4px_4px_0px_var(--color-brand-midnight)]">BREAK</span>
                                <span className="block text-acid-green -mt-4 transform -rotate-2 [-webkit-text-stroke:2px_var(--color-brand-midnight)] [text-shadow:6px_6px_0px_var(--color-brand-midnight)]">RULES</span>
                            </motion.h1>
                        </div>
                    </Wrapper>

                    {/* Overlaid Black Banner */}
                    <Wrapper identity={{ displayName: "Overlaid Black Banner", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }} className="absolute top-[65%] w-[110%] md:w-[600px] -ml-4">
                        <motion.div
                            initial={{ x: -100, opacity: 0, rotate: -2 }}
                            animate={{ x: 0, opacity: 1, rotate: -3 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-brand-midnight text-white px-8 py-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-[3px] border-brand-midnight pointer-events-auto"
                        >
                            <h2 className="text-xl md:text-3xl font-display text-transform-primary tracking-tight text-center leading-none">
                                TYPOGRAPHY IS NOT JUST FOR READING.
                            </h2>
                        </motion.div>
                    </Wrapper>
                </motion.div>

                {/* Scrolling Marquee Ribbon */}
                <Wrapper identity={{ displayName: "Scrolling Marquee Ribbon", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }} className="absolute bottom-24 left-0 right-0 w-[110%] -rotate-2 origin-left z-20">
                    <div className="overflow-hidden bg-white border-y-[length:var(--card-border-width,2px)] border-brand-midnight shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex whitespace-nowrap py-3">
                        <motion.div
                            className="flex whitespace-nowrap text-brand-midnight font-dev text-transform-tertiary tracking-widest text-sm"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                        >
                            <span className="px-4">{repeatedMarquee}</span>
                            <span className="px-4">{repeatedMarquee}</span>
                        </motion.div>
                    </div>
                </Wrapper>

                {/* Bottom Right Sticker */}
                <Wrapper identity={{ displayName: "Version Sticker", filePath: "zap/sections/atoms/typography/wild-preview.tsx", type: "Wrapped Snippet" }} className="absolute bottom-8 right-8 z-30">
                    <motion.div
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: -10 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="bg-brand-midnight border-2 border-white px-3 py-1 shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                    >
                        <span className="text-white font-dev text-transform-tertiary font-bold text-sm">v2.0</span>
                    </motion.div>
                </Wrapper>

            </div>
        </Wrapper >
    );
};
