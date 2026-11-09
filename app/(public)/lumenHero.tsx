"use client";

import Navbar from "@/components/shared/navbar";
import React, { useEffect, useRef, useState } from "react";

export default function LumenHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [night, setNight] = useState<number>(1);
  const [kVal, setKVal] = useState<number>(1);

  useEffect(() => {
    const root = document.documentElement.style;
    const calm = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const SINK = 240, RISE = 820, DEPTH = 0.27;
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const smooth = (a: number, b: number, x: number) => {
      x = clamp((x - a) / (b - a));
      return x * x * (3 - 2 * x);
    };

    let target = 1, from = 1, start = -1e9, queued: number | null = null, swapped = true, k = 1, animating = false;
    let animFrameId: number;

    const cv = canvasRef.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    let U: Record<string, WebGLUniformLocation> = {};

    if (gl) {
      const vs = `#version 300 es
      void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}`;
      const fs = `#version 300 es
      precision highp float;
      uniform vec2 R;uniform float T,S,K;out vec4 O;
      float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float a=.5,s=0.;mat2 m=mat2(1.6,1.2,-1.2,1.6);p=mat2(.8,.6,-.6,.8)*p+5.3;for(int i=0;i<5;i++){s+=a*n(p);p=m*p;a*=.5;}return s;}
      void main(){
        vec2 uv=gl_FragCoord.xy/R;uv.y=1.-uv.y;
        float asp=R.x/R.y;vec2 p=vec2(uv.x*asp,uv.y);
        float t=T*.05;
        vec2 w=vec2(fbm(p*1.3+vec2(t,-t*.6)),fbm(p*1.3+vec2(-t*.8,t)+7.));
        float d=fbm(p*1.9+w*1.7+vec2(t*1.6,-t*1.1+S*.5));
        float e=fbm(p*.9-w+vec2(-t,t*.5)+3.);
        float low=smoothstep(.70,1.04,uv.y+(d-.5)*.34);
        float side=smoothstep(.2,.0,uv.x+(e-.5)*.28)+smoothstep(.8,1.,uv.x+(e-.5)*.28);
        side*=smoothstep(.25,.6,uv.y)*.2;
        float wisps=smoothstep(.5,.78,d)*smoothstep(.22,.5,uv.y)*smoothstep(.86,.6,uv.y)*.18;
        float rest=clamp(low+side+wisps,0.,1.);
        float front=1.02-S*.68;
        float rise=smoothstep(front-.02,front+.26,uv.y+(d-.5)*.5);
        float haze=S*(.3+.46*d);
        float a=clamp(max(rest,max(rise*.97,haze)),0.,1.);
        vec3 dayA=vec3(.97,.93,.84),dayB=vec3(.79,.78,.71);
        vec3 nitA=vec3(.40,.45,.57),nitB=vec3(.15,.19,.29);
        vec3 c=mix(mix(dayB,dayA,d*1.15),mix(nitB,nitA,d*1.1),K);
        float porch=exp(-dot((uv-vec2(.72,.74))*vec2(1.7,2.6),(uv-vec2(.72,.74))*vec2(1.7,2.6))*3.2);
        c=mix(c,vec3(.86,.55,.27),K*porch*.42*(1.-S));
        O=vec4(c*a,a);
      }`;
      const sh = (type: number, source: string) => {
        const o = gl.createShader(type)!;
        gl.shaderSource(o, source);
        gl.compileShader(o);
        return o;
      };
      const pr = gl.createProgram()!;
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(pr);
      gl.useProgram(pr);
      for (const u of ["R", "T", "S", "K"]) {
        U[u] = gl.getUniformLocation(pr, u)!;
      }
    }

    const resize = () => {
      if (!gl || !cv) return;
      const w = Math.round(Math.min(window.innerWidth, 960));
      const h = Math.round((w * window.innerHeight) / window.innerWidth);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const show = (n: number) => {
      const setM = document.getElementById("setM");
      const setN = document.getElementById("setN");
      if (setM && setN) {
        setM.classList.toggle("is-on", n === 0);
        setN.classList.toggle("is-on", n === 1);
      }
    };

    const begin = (n: number, now: number) => {
      target = n;
      from = k;
      start = now;
      swapped = false;
      animating = true;
    };

    const handlePick = (n: number, now: number) => {
      setNight(n);
      if (calm) {
        target = n;
        k = n;
        setKVal(n);
        show(n);
        return;
      }
      if (animating) queued = n;
      else begin(n, now);
    };

    const btnM = document.getElementById("bm");
    const btnN = document.getElementById("bn");

    const onMClick = () => handlePick(0, performance.now());
    const onNClick = () => handlePick(1, performance.now());

    btnM?.addEventListener("click", onMClick);
    btnN?.addEventListener("click", onNClick);

    let clock = 0;
    const loop = (now: number) => {
      clock = now;
      const d = now - start;
      let y = 0, s = 0, dip = 0, k2 = k;
      if (animating) {
        if (d < SINK) {
          const x = d / SINK;
          y = x * x * (3 - 2 * x) * DEPTH;
        } else {
          if (!swapped) {
            swapped = true;
            show(target);
          }
          const x = clamp((d - SINK) / RISE);
          y = Math.pow(1 - x, 3.4) * DEPTH;
        }
        s = smooth(0, SINK * 0.92, d) * (1 - smooth(SINK + 70, SINK + RISE * 0.92, d));
        dip = smooth(30, 190, d) * (1 - smooth(330, 720, d));
        k = from + (target - from) * smooth(120, 520, d);
        k2 = from + (target - from) * smooth(340, 760, d);
        setKVal(k);

        if (d >= SINK + RISE) {
          animating = false;
          k = k2 = target;
          y = s = dip = 0;
          if (queued !== null && queued !== target) {
            const q = queued;
            queued = null;
            begin(q, now);
          } else {
            queued = null;
          }
        }
      }
      root.setProperty("--sink", (y * window.innerHeight).toFixed(1) + "px");
      root.setProperty("--k", k.toFixed(3));
      root.setProperty("--k2", k2.toFixed(3));
      root.setProperty("--dip", dip.toFixed(3));

      if (gl) {
        gl.uniform2f(U.R, cv.width, cv.height);
        gl.uniform1f(U.T, now / 1000);
        gl.uniform1f(U.S, s);
        gl.uniform1f(U.K, k);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      animFrameId = requestAnimationFrame(loop);
    };
    animFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      btnM?.removeEventListener("click", onMClick);
      btnN?.removeEventListener("click", onNClick);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <main className="relative h-[100svh] min-h-[520px] overflow-hidden isolate bg-[#0b1426]">
      <Navbar k={kVal} />

      {/* 1. Sky Layer */}
      <div className="absolute inset-0 w-full h-full">
        <img
          id="skyM"
          alt=""
          src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040343_a73684b4-3f71-4613-a843-c8be80fb1211.png&w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover object-[50%_62%] blur-[calc(7*var(--u))] scale-105"
        />
        <img
          id="skyN"
          alt=""
          src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040308_f31964ab-ed8e-4ea4-90eb-3226c0859936.png&w=1600&q=80"
          style={{ opacity: "var(--k)" }}
          className="absolute inset-0 w-full h-full object-cover object-[50%_62%] blur-[calc(7*var(--u))] scale-105"
        />
      </div>

      {/* 2. Home Moving Layer */}
      <div className="absolute inset-0 w-full h-full will-change-transform transform-[translate3d(0,var(--sink,0px),0)]">
        {/* Morning Set */}
        <div className="absolute inset-0 invisible [.is-on&]:visible" id="setM">
          <div className="absolute inset-0 w-full h-full [mask-image:linear-gradient(transparent_54%,#000_64%)] [-webkit-mask-image:linear-gradient(transparent_54%,#000_64%)]">
            <img
              alt=""
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040259_1be34093-835e-4de4-b3a8-f875e6a74591.png&w=2560&q=85"
              className="w-full h-full object-cover object-[50%_62%]"
            />
          </div>
          <img
            alt="A charcoal farmhouse with solar panels in soft morning light"
            src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040416_e3b05fa4-cc80-4a43-afde-8a0a053933e9.png&w=2560&q=85"
            className="absolute inset-0 w-full h-full object-cover object-[50%_62%]"
          />
        </div>

        {/* Night Set */}
        <div className="absolute inset-0 invisible [.is-on&]:visible is-on" id="setN">
          <div className="absolute inset-0 w-full h-full [mask-image:linear-gradient(transparent_54%,#000_64%)] [-webkit-mask-image:linear-gradient(transparent_54%,#000_64%)]">
            <img
              alt=""
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040211_c8fd4865-285e-4c1f-8a37-4bfe0771357b.png&w=2560&q=85"
              className="w-full h-full object-cover object-[50%_62%]"
            />
          </div>
          <img
            alt="The same farmhouse at dusk with warm amber windows"
            src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_040415_2ab95096-8c39-449f-b36c-17c2813815a4.png&w=2560&q=85"
            className="absolute inset-0 w-full h-full object-cover object-[50%_62%]"
          />
        </div>
      </div>

      {/* 3. Tilt-Shift Lens Layer */}
      <div className="absolute inset-0 pointer-events-none backdrop-blur-[calc(9*var(--u))] [mask-image:linear-gradient(transparent_70%,#000_92%)] [-webkit-mask-image:linear-gradient(transparent_70%,#000_92%)]" />

      {/* 4. WebGL2 Fog Canvas */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 5. UI Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pointer-events-none *:pointer-events-auto">
        <h1 className="mt-[calc(58*var(--u))] text-center text-[calc(64*var(--u))] leading-[1.09] font-medium tracking-[-0.022em] text-[var(--ink)]">
          <span className="block opacity-[calc(1_-_var(--dip)*.8)]">$0 Electricity Bills</span>
          <span>
            <i className="not-italic text-[color-mix(in_srgb,#14202f_calc((1_-_var(--k2))*42%),color-mix(in_srgb,#fff_calc(var(--k2)*100%),#7c8794))]">for the next</i>{" "}
            <span className="inline opacity-[calc(1_-_var(--dip)*.8)]">7 Years</span>
          </span>
        </h1>

        <div className="mt-auto pb-[calc(40*var(--u))] flex flex-col items-center w-full px-4">
          <div
            className="relative grid grid-cols-2 w-[calc(524*var(--u))] max-w-full h-[calc(86*var(--u))] p-[calc(2*var(--u))] rounded-[calc(16*var(--u))] overflow-hidden bg-[rgba(120,132,140,.34)] border border-white/20 backdrop-blur-[calc(14*var(--u))]"
            role="group"
            aria-label="Time of day"
          >
            <button
              id="bm"
              aria-pressed={night === 0}
              onClick={() => setNight(0)}
              style={{ "--on": "calc(1 - var(--k))" } as React.CSSProperties}
              className="relative flex flex-col items-center justify-center gap-[calc(3*var(--u))] rounded-[calc(13*var(--u))] text-white overflow-hidden before:absolute before:inset-0 before:rounded-inherit before:bg-[linear-gradient(160deg,#f7f8dc,#e2ee9f_90%)] before:shadow-[inset_0_0_calc(18*var(--u))_rgba(255,255,255,.65)] before:opacity-[var(--on)] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-4px]"
            >
              <b className="relative text-[calc(23*var(--u))] font-medium tracking-[-0.012em] text-[color-mix(in_srgb,#1c2316_calc(var(--on)*100%),#fff)]">Morning</b>
              <small className="relative text-[calc(15*var(--u))] opacity-72 text-[color-mix(in_srgb,#1c2316_calc(var(--on)*100%),#fff)]">$0 for Electricity</small>
            </button>
            <button
              id="bn"
              aria-pressed={night === 1}
              onClick={() => setNight(1)}
              style={{ "--on": "var(--k)" } as React.CSSProperties}
              className="relative flex flex-col items-center justify-center gap-[calc(3*var(--u))] rounded-[calc(13*var(--u))] text-white overflow-hidden before:absolute before:inset-0 before:rounded-inherit before:bg-[linear-gradient(160deg,#f7f8dc,#e2ee9f_90%)] before:shadow-[inset_0_0_calc(18*var(--u))_rgba(255,255,255,.65)] before:opacity-[var(--on)] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-4px]"
            >
              <b className="relative text-[calc(23*var(--u))] font-medium tracking-[-0.012em] text-[color-mix(in_srgb,#1c2316_calc(var(--on)*100%),#fff)]">Night</b>
              <small className="relative text-[calc(15*var(--u))] opacity-72 text-[color-mix(in_srgb,#1c2316_calc(var(--on)*100%),#fff)]">$0 for Electricity</small>
            </button>
          </div>
          <p className="mt-[calc(22*var(--u))] text-center text-[calc(16.4*var(--u))] leading-[1.3] text-[var(--soft)] max-w-lg">
            Forget the energy market, weather conditions and seasons. Our Smart<br className="hidden sm:inline" /> Controller guarantees you get no electricity bill for seven years.
          </p>
        </div>
      </div>
    </main>
  );
}