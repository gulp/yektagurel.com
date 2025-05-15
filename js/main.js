// Error boundary component
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: 'red', padding: '20px', fontFamily: 'sans-serif' }}>
                    <h2>Something went wrong</h2>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <button onClick={() => window.location.reload()}>Reload Page</button>
                </div>
            );
        }
        return this.props.children;
    }
}

const { useState, useEffect, useMemo, useRef, useCallback } = React;

const DEBUG_LOGS = false; 

const ORIGINAL_STATEMENTS = [ " admitting it doesn’t have all the answers.", " saying, “Can you clarify that?”", " stepping away from the screen to think.", " leaning on the team.", " saying “Can you help with this?”", " balancing work and rest.", " setting its boundaries.", " needing space to think.", " accepting the small things, like coffee runs.", " offering constructive criticism.", " improving not just its own work but the work of others.", " choosing face-to-face over chat.", " laughing with colleagues.", " having quiet moments." ];
const PREFIX1_TARGET_TEXT = "/imagine"; const PREFIX2_TARGET_TEXT = " an intelligence"; 

const WELCOME_TEXT_PART_1 = "Hi, I'm Yekta — a human and an interaction designer. Let’s get to know each other.\n\n";
const WELCOME_TEXT_PART_2 = "Drop me a line if you're curious, or have a nosey if you're the quiet type.\n\n";
const BACK_LINK_TEXT = "←back ";
const TEXT_HIGHLIGHTS_PART1 = [
    { phrase: "Yekta", className: "highlight-name" },
    { phrase: "human", className: "highlight-name" }, 
    { phrase: "interaction designer.", className: "highlight-name" }
];
const LINK_DEFINITIONS_PART2 = [ { phrase: "Drop me a line", href: "mailto:me@yektagurel.com", type: 'link' }, { phrase: "have a nosey", href: "https://www.linkedin.com/in/yektagurel", type: 'link' }];
const OVERALL_SPEED_FACTOR = 1 / 1.2; const WELCOME_PART1_SPEED_MULTIPLIER = 1.25; const WELCOME_MESSAGE_SPEED_MULTIPLIER = 2.5; const WELCOME_CHAR_MIN_DELAY_MS = 10;
const INITIAL_BLANK_CURSOR_DELAY_MS = 1000;
const PAUSE_AFTER_TYPING_MS = 2000; const PAUSE_AFTER_ERASING_MS = 500; const PAUSE_BEFORE_WELCOME_MESSAGE_TYPING_MS = 700;
const WORD_ERASE_DELAY_MS = 150; const INTER_ERASE_PHASE_PAUSE_MS = 200;
const VERY_FIRST_ERASE_DELAY_MS = 250; const SECOND_ERASE_DELAY_MS = 180; const ACCELERATED_ERASING_MIN_DELAY_MS = 35; const ERASING_ACCELERATION_FACTOR = 0.70;
const BASE_HUMAN_MIN_DELAY_MS = 50; const BASE_HUMAN_MAX_DELAY_MS = 150;
const WELCOME_PAUSE_AFTER_SPACE_MS = 50; const WELCOME_PAUSE_AFTER_PUNCTUATION_MS = 700; const WELCOME_PAUSE_AFTER_LINE_BREAK_MS = 1000; 
const IL_EXTRA_PAUSE_AFTER_SPACE_MS = 120; const IL_EXTRA_PAUSE_AFTER_PUNCTUATION_MS = 190; const IL_EXTRA_PAUSE_AFTER_LINE_BREAK_MS = 250; 
const TYPING_SPEED_SKEW_FACTOR = 1.8; 
const PUNCTUATION_CHARS = ['.', ',', '?', '!', '”', '“', '’', '‘', '–', '—', ':']; 
const BURST_MIN_LENGTH = 2; const BURST_MAX_LENGTH = 5; const INTRA_BURST_MIN_DELAY_MS = 20*OVERALL_SPEED_FACTOR; const INTRA_BURST_MAX_DELAY_MS = 40*OVERALL_SPEED_FACTOR; const INTER_BURST_BASE_PAUSE_MS = 90*OVERALL_SPEED_FACTOR; const BURST_SKEW_FACTOR = 2.5;
const DELAY_AFTER_PREFIX_FORMATION = 250; 

const renderStyledText = (text, definitions) => { if (!text || !definitions || definitions.length === 0) return [ <span key="text-only">{text || ''}</span> ]; let lastIndex = 0; const parts = []; let key = 0; const regexParts = definitions.map(def => def.phrase.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')); const combinedRegex = new RegExp(`(${regexParts.join('|')})`, 'g'); text.replace(combinedRegex, (match, ...args) => { const matchIndex = args[args.length - 2]; if (matchIndex > lastIndex) parts.push(<span key={`text-${key++}`}>{text.substring(lastIndex, matchIndex)}</span>); const def = definitions.find(d => d.phrase === match); if (def.type === 'link') { parts.push(<a href={def.href} key={`link-${key++}`} target="_blank" rel="noopener noreferrer">{match}</a>); } else if (def.className) { parts.push(<span className={def.className} key={`highlight-${key++}`}>{match}</span>); } else { parts.push(<span key={`match-${key++}`}>{match}</span>); } lastIndex = matchIndex + match.length; }); if (lastIndex < text.length) parts.push(<span key={`text-${key++}`}>{text.substring(lastIndex)}</span>); return parts.length > 0 ? parts : [ <span key="text-only-fallback">{text || ''}</span> ]; };
const scheduleAnimation = (tRef,h,d)=>{clearTimeout(tRef.current);tRef.current=setTimeout(h,d);};
const eraseWordByWordInternal = (t,sF,oC,tRef,lSF)=>{const tr=t.trimEnd();if(tr===""){sF("");lSF(oC,WORD_ERASE_DELAY_MS/2);return;}let lwi=tr.lastIndexOf(' ');lwi=(lwi===-1)?0:lwi+1;const o=t.indexOf(tr);const c=o+lwi;const n=t.substring(0,c).trimEnd();sF(n);if(n.length===0&&tr.length>0){lSF(oC,WORD_ERASE_DELAY_MS);}else if(n.length>0){lSF(()=>eraseWordByWordInternal(n,sF,oC,tRef,lSF),WORD_ERASE_DELAY_MS);}else{lSF(oC,WORD_ERASE_DELAY_MS/2);}};
const ImagineButton = ({ onClick, isVisible }) => (<div className={`imagine-all-button-wrapper ${isVisible ? 'visible' : ''}`}><button className="imagine-all-button" onClick={onClick} role="button"><span className="emoji" role="img" aria-label="party popper">🎉</span><span>Imagine all</span></button></div>);

const IntroLoopTypewriter = ({ statementsList, startFullErase, onFullEraseComplete, onFirstStatementLoopCycleComplete }) => {
    const [internalPhase, setInternalPhase] = useState('initial_delay'); 
    const [typedPrefix1, setTypedPrefix1] = useState(''); const [isPrefix1Pill, setIsPrefix1Pill] = useState(false);
    const [typedPrefix2, setTypedPrefix2] = useState(''); const [isPrefix2Styled, setIsPrefix2Styled] = useState(false);
    const [currentStatementIdx, setCurrentStatementIdx] = useState(0); const [typedDynamicStmt, setTypedDynamicStmt] = useState('');
    const [isStmtTypingForward, setIsStmtTypingForward] = useState(true); const [mainCursorChar, setMainCursorChar] = useState('\u00A0'); 
    const [currentP1TextForErase, setCurrentP1TextForErase] = useState(''); const [currentP2TextForErase, setCurrentP2TextForErase] = useState(''); const [currentStmtTextForErase, setCurrentStmtTextForErase] = useState('');
    const animationTimeoutRef = useRef(null); const loopInitiatedRef = useRef(false); const firstCycleCompletedRef = useRef(false);
    const currentTargetStmtText = useMemo(() => (statementsList && statementsList[currentStatementIdx]) || "", [statementsList, currentStatementIdx]);
    const burstCharsRef = useRef(0); const burstTargetRef = useRef(0); const stmtEraseCountRef = useRef(0); const stmtEraseDelayRef = useRef(VERY_FIRST_ERASE_DELAY_MS);
    const localScheduleFn = useCallback((handler, delay) => scheduleAnimation(animationTimeoutRef, handler, delay), []);
    const eraseWordByWord = useCallback((text, setTextFn, onComplete) => eraseWordByWordInternal(text, setTextFn, onComplete, animationTimeoutRef, localScheduleFn), [localScheduleFn]);
    const humanMinDelay = BASE_HUMAN_MIN_DELAY_MS*OVERALL_SPEED_FACTOR; const humanMaxDelay = BASE_HUMAN_MAX_DELAY_MS*OVERALL_SPEED_FACTOR;
    const spacePause = IL_EXTRA_PAUSE_AFTER_SPACE_MS*OVERALL_SPEED_FACTOR; const punctPause = IL_EXTRA_PAUSE_AFTER_PUNCTUATION_MS*OVERALL_SPEED_FACTOR;
    const lineBreakPauseILT = IL_EXTRA_PAUSE_AFTER_LINE_BREAK_MS*OVERALL_SPEED_FACTOR; 
    
    useEffect(() => { if (startFullErase && !internalPhase.startsWith('full_erase')) { clearTimeout(animationTimeoutRef.current); setCurrentStmtTextForErase(typedDynamicStmt); setCurrentP1TextForErase(isPrefix1Pill ? PREFIX1_TARGET_TEXT : typedPrefix1); setCurrentP2TextForErase(typedPrefix2); setMainCursorChar('\u00A0'); setInternalPhase('full_erase_statement'); } }, [startFullErase, internalPhase, typedDynamicStmt, isPrefix1Pill, typedPrefix1, typedPrefix2]);
    
    useEffect(() => {
        if (DEBUG_LOGS) console.log(`[ILT] Phase: ${internalPhase}, Cursor: "${mainCursorChar}", Stmt: "${typedDynamicStmt}"`);
        let scheduled = false; const scheduleOnce = (h, d) => { if (!scheduled) { localScheduleFn(h, d); scheduled = true; }};
        const hDST = () => { if (isStmtTypingForward) { if (typedDynamicStmt.length < currentTargetStmtText.length) { const cl = typedDynamicStmt.length; const nc = currentTargetStmtText[cl]; setTypedDynamicStmt(prev => prev + nc); setMainCursorChar(cl + 1 < currentTargetStmtText.length ? currentTargetStmtText[cl + 1] : nc); } } else { const t_orig = typedDynamicStmt; const tr_trimmed = t_orig.trimEnd(); if (tr_trimmed === "") { setTypedDynamicStmt(""); } else { let last_space_idx_in_trimmed = tr_trimmed.lastIndexOf(' '); let start_of_last_word_in_trimmed; if (last_space_idx_in_trimmed === -1) { start_of_last_word_in_trimmed = 0; } else { start_of_last_word_in_trimmed = last_space_idx_in_trimmed + 1; } const offset_of_trimmed_in_original = t_orig.indexOf(tr_trimmed); const cut_at_index_in_original = offset_of_trimmed_in_original + start_of_last_word_in_trimmed; let newText = t_orig.substring(0, cut_at_index_in_original); newText = newText.trimEnd(); setTypedDynamicStmt(newText); } setMainCursorChar('\u00A0'); } };
        if (internalPhase === 'initial_delay' && !startFullErase) { scheduleOnce(() => {setMainCursorChar(PREFIX1_TARGET_TEXT[0] || ''); setInternalPhase('typing_prefix1_literal');}, INITIAL_BLANK_CURSOR_DELAY_MS); } 
        else if (internalPhase.startsWith('full_erase')) { if (internalPhase === 'full_erase_statement') { if (currentStmtTextForErase.length > 0) eraseWordByWord(currentStmtTextForErase, setCurrentStmtTextForErase, () => scheduleOnce(() => setInternalPhase('full_erase_prefix2'), INTER_ERASE_PHASE_PAUSE_MS)); else scheduleOnce(() => setInternalPhase('full_erase_prefix2'), INTER_ERASE_PHASE_PAUSE_MS / 2); } else if (internalPhase === 'full_erase_prefix2') { if (currentP2TextForErase.trim().length > 0) eraseWordByWord(currentP2TextForErase, setCurrentP2TextForErase, () => scheduleOnce(() => setInternalPhase('full_erase_prefix1'), INTER_ERASE_PHASE_PAUSE_MS)); else scheduleOnce(() => setInternalPhase('full_erase_prefix1'), INTER_ERASE_PHASE_PAUSE_MS / 2); } else if (internalPhase === 'full_erase_prefix1') { const tP1E = isPrefix1Pill ? PREFIX1_TARGET_TEXT : currentP1TextForErase; const eP1D = () => {setIsPrefix1Pill(false); setIsPrefix2Styled(false); setCurrentP1TextForErase(''); scheduleOnce(() => setInternalPhase('full_erase_done'), INTER_ERASE_PHASE_PAUSE_MS / 2);}; if (tP1E.length > 0) { if(isPrefix1Pill) { setIsPrefix1Pill(false); setCurrentP1TextForErase(''); scheduleOnce(eP1D, WORD_ERASE_DELAY_MS); } else { eraseWordByWord(tP1E, setCurrentP1TextForErase, eP1D); } } else { eP1D(); } } else if (internalPhase === 'full_erase_done') { setMainCursorChar('\u00A0'); onFullEraseComplete(); } } 
        else if (internalPhase === 'typing_prefix1_literal') { if (typedPrefix1.length < PREFIX1_TARGET_TEXT.length) { const ni=typedPrefix1.length; const ct=PREFIX1_TARGET_TEXT[ni]; let td=humanMinDelay+Math.random()*(humanMaxDelay-humanMinDelay); scheduleOnce(()=>{setTypedPrefix1(p=>p+ct);setMainCursorChar(ni+1<PREFIX1_TARGET_TEXT.length?PREFIX1_TARGET_TEXT[ni+1]:' ');},td); } else { if(mainCursorChar===' ')setInternalPhase('forming_prefix1_pill');} } 
        else if (internalPhase === 'forming_prefix1_pill') { setIsPrefix1Pill(true); setMainCursorChar(PREFIX2_TARGET_TEXT[0]||''); scheduleOnce(()=>setInternalPhase('typing_prefix2_literal'),DELAY_AFTER_PREFIX_FORMATION); } 
        else if (internalPhase === 'typing_prefix2_literal') { if (typedPrefix2.length < PREFIX2_TARGET_TEXT.length) { const ni=typedPrefix2.length; const ct=PREFIX2_TARGET_TEXT[ni]; let td=humanMinDelay+Math.random()*(humanMaxDelay-humanMinDelay); if(ct===' ')td+=spacePause/2; scheduleOnce(()=>{setTypedPrefix2(p=>p+ct);const nextChar=ni+1<PREFIX2_TARGET_TEXT.length?PREFIX2_TARGET_TEXT[ni+1]:((statementsList[0] || "")[0]||'\u00A0');setMainCursorChar(nextChar);},td); } else {setInternalPhase('styling_prefix2');} } 
        else if (internalPhase === 'styling_prefix2') { setIsPrefix2Styled(true); scheduleOnce(()=>setInternalPhase('looping_statements'),DELAY_AFTER_PREFIX_FORMATION); } 
        else if (internalPhase === 'looping_statements') { if(!loopInitiatedRef.current){ loopInitiatedRef.current=true; setMainCursorChar((currentTargetStmtText[0]||"")||'\u00A0'); if(currentTargetStmtText.length > 0) { scheduleOnce(hDST,100*OVERALL_SPEED_FACTOR); } else { scheduleOnce(()=>{ setIsStmtTypingForward(false); setMainCursorChar('\u00A0'); stmtEraseCountRef.current=0; stmtEraseDelayRef.current=VERY_FIRST_ERASE_DELAY_MS; }, PAUSE_AFTER_TYPING_MS); } } else { if(isStmtTypingForward){ if(typedDynamicStmt==='' && mainCursorChar===(currentTargetStmtText[0]||'') && currentTargetStmtText.length>0){ burstCharsRef.current=0; burstTargetRef.current=0; scheduleOnce(hDST,(PAUSE_AFTER_ERASING_MS/2)*OVERALL_SPEED_FACTOR); } else if(typedDynamicStmt==='' && currentTargetStmtText.length===0){ scheduleOnce(()=>{ setIsStmtTypingForward(false); setMainCursorChar('\u00A0'); stmtEraseCountRef.current=0; stmtEraseDelayRef.current=VERY_FIRST_ERASE_DELAY_MS; },PAUSE_AFTER_TYPING_MS); } else if(typedDynamicStmt.length<currentTargetStmtText.length){ let d;const lc=typedDynamicStmt.slice(-1);let jcb=false;if(lc){let charPauseValue=0;if(lc===' ')charPauseValue=spacePause;else if(lc==='\n')charPauseValue=lineBreakPauseILT;else if(PUNCTUATION_CHARS.includes(lc))charPauseValue=punctPause;if(lc===' '||lc==='\n'||PUNCTUATION_CHARS.includes(lc)){burstCharsRef.current=0;burstTargetRef.current=0;d=(Math.floor(Math.pow(Math.random(),TYPING_SPEED_SKEW_FACTOR)*(humanMaxDelay-humanMinDelay+1))+humanMinDelay)+charPauseValue;}else{if(burstTargetRef.current>0){burstCharsRef.current++;if(burstCharsRef.current>=burstTargetRef.current)jcb=true;}if(jcb){d=INTER_BURST_BASE_PAUSE_MS+Math.floor(Math.random()*35*OVERALL_SPEED_FACTOR);burstCharsRef.current=0;burstTargetRef.current=0;}else if(burstCharsRef.current===0){let nbt=Math.floor(Math.random()*(BURST_MAX_LENGTH-BURST_MIN_LENGTH+1))+BURST_MIN_LENGTH;const cl=currentTargetStmtText.length-typedDynamicStmt.length;let ns=currentTargetStmtText.indexOf(' ',typedDynamicStmt.length);if(ns===-1)ns=currentTargetStmtText.length;const cns=ns-typedDynamicStmt.length;let mb=Math.min(cl,cns>0?cns:1);if(mb<=0)mb=1;burstTargetRef.current=Math.min(nbt,mb);d=Math.floor(Math.pow(Math.random(),BURST_SKEW_FACTOR)*(INTRA_BURST_MAX_DELAY_MS-INTRA_BURST_MIN_DELAY_MS+1))+INTRA_BURST_MIN_DELAY_MS;}else{d=Math.floor(Math.pow(Math.random(),BURST_SKEW_FACTOR)*(INTRA_BURST_MAX_DELAY_MS-INTRA_BURST_MIN_DELAY_MS+1))+INTRA_BURST_MIN_DELAY_MS;}}}scheduleOnce(hDST,Math.max(0,d)); } else if(typedDynamicStmt===currentTargetStmtText){ if(mainCursorChar!==(currentTargetStmtText.length>0?currentTargetStmtText.slice(-1):'')&&currentTargetStmtText.length>0){setMainCursorChar(currentTargetStmtText.slice(-1));} scheduleOnce(()=>{ setIsStmtTypingForward(false); setMainCursorChar('\u00A0'); burstCharsRef.current=0; burstTargetRef.current=0; stmtEraseCountRef.current=0; stmtEraseDelayRef.current=VERY_FIRST_ERASE_DELAY_MS; },PAUSE_AFTER_TYPING_MS); } } else { if(typedDynamicStmt.length > 0){ stmtEraseCountRef.current++; if(stmtEraseCountRef.current===1)stmtEraseDelayRef.current=VERY_FIRST_ERASE_DELAY_MS; else if(stmtEraseCountRef.current===2)stmtEraseDelayRef.current=SECOND_ERASE_DELAY_MS; else stmtEraseDelayRef.current=Math.max(ACCELERATED_ERASING_MIN_DELAY_MS,stmtEraseDelayRef.current*ERASING_ACCELERATION_FACTOR); scheduleOnce(hDST,stmtEraseDelayRef.current*OVERALL_SPEED_FACTOR); } else { setInternalPhase('looping_statements_erase_pause'); } } } } 
        else if (internalPhase === 'looping_statements_erase_pause') {  setMainCursorChar('\u00A0');  scheduleOnce(()=>{ const ni=(currentStatementIdx+1)%(statementsList.length||1); if(currentStatementIdx===0 && !firstCycleCompletedRef.current && statementsList.length > 0){ onFirstStatementLoopCycleComplete(); firstCycleCompletedRef.current=true; } setCurrentStatementIdx(ni); setIsStmtTypingForward(true); setTypedDynamicStmt(''); const ns=(statementsList[ni]||""); setMainCursorChar(ns.length>0?ns[0]:'\u00A0'); setInternalPhase('looping_statements'); },PAUSE_AFTER_ERASING_MS); }
        return () => clearTimeout(animationTimeoutRef.current);
    }, [ internalPhase, typedPrefix1, typedPrefix2, isPrefix1Pill, isPrefix2Styled, typedDynamicStmt, mainCursorChar, isStmtTypingForward, currentStatementIdx, currentTargetStmtText, statementsList, currentP1TextForErase, currentP2TextForErase, currentStmtTextForErase, startFullErase, onFullEraseComplete, eraseWordByWord, localScheduleFn, humanMinDelay, humanMaxDelay, spacePause, punctPause, lineBreakPauseILT, onFirstStatementLoopCycleComplete ]);
    
    let p1R_disp = typedPrefix1, p2R_disp = typedPrefix2, stmtR_disp = typedDynamicStmt, curR_disp = mainCursorChar;
    let showWordJoiner = false;

    if (internalPhase.startsWith('full_erase')) { p1R_disp = currentP1TextForErase; if (isPrefix1Pill && internalPhase !== 'full_erase_done' && currentP1TextForErase.length > 0 && internalPhase !== 'full_erase_prefix1') p1R_disp = PREFIX1_TARGET_TEXT; else if (internalPhase === 'full_erase_prefix1' && isPrefix1Pill && currentP1TextForErase === '') p1R_disp = ''; p2R_disp = currentP2TextForErase; stmtR_disp = currentStmtTextForErase; curR_disp = '\u00A0'; if (internalPhase === 'full_erase_done') { p1R_disp = ''; p2R_disp = ''; stmtR_disp = ''; curR_disp = '\u00A0'; }
    } else if (internalPhase === 'initial_delay') { p1R_disp = ''; p2R_disp = ''; stmtR_disp = ''; curR_disp = '\u00A0';
    } else if (internalPhase !== 'idle') {
        if (internalPhase === 'typing_prefix1_literal') { if (typedPrefix1.endsWith(mainCursorChar) && !['\u00A0', ' ', '\n'].includes(mainCursorChar)) { p1R_disp = typedPrefix1.slice(0, -1); }
        } else if (internalPhase === 'typing_prefix2_literal') { if (typedPrefix2.endsWith(mainCursorChar) && !['\u00A0', ' ', '\n'].includes(mainCursorChar)) { p2R_disp = typedPrefix2.slice(0, -1); }
        } else if (internalPhase === 'looping_statements') {
            if (isStmtTypingForward) { if (typedDynamicStmt.endsWith(mainCursorChar) && !['\u00A0', ' ', '\n'].includes(mainCursorChar)) { stmtR_disp = typedDynamicStmt.slice(0, -1); } if (typedDynamicStmt === currentTargetStmtText && typedDynamicStmt.length > 0 && mainCursorChar === typedDynamicStmt.slice(-1) && !['\u00A0', ' ', '\n'].includes(mainCursorChar)) { stmtR_disp = typedDynamicStmt.slice(0, -1); curR_disp = mainCursorChar; }
            } else { curR_disp = '\u00A0'; }
        } else if (internalPhase === 'looping_statements_erase_pause') { curR_disp = '\u00A0'; }
        
        let textBeforeCursorContent = ((isPrefix1Pill ? PREFIX1_TARGET_TEXT : p1R_disp) + (isPrefix2Styled ? PREFIX2_TARGET_TEXT : p2R_disp) + stmtR_disp).trim();
        if (curR_disp && !['\u00A0', ' ', '\n'].includes(curR_disp) && textBeforeCursorContent.length > 0) { showWordJoiner = true; } else { showWordJoiner = false; }
    }

    return(<div className="typewriter-base intro-loop-container">
        {isPrefix1Pill?<span className="typewriter-prefix-pill">{PREFIX1_TARGET_TEXT}</span>:(p1R_disp&&<span>{p1R_disp}</span>)}
        <span className={isPrefix2Styled?"typewriter-prefix-rest-styled":"typewriter-prefix-rest-typing"}>{p2R_disp}</span>
        <span className="typed-text-dynamic">{stmtR_disp}</span>
        {showWordJoiner && '\u2060'}
        {curR_disp&&(<span className={`cursor ${curR_disp==='\u00A0'||curR_disp===' '||curR_disp==='\n'?'empty-char':''}`}>{curR_disp===' '||curR_disp==='\n'?'\u00A0':curR_disp}</span>)}
    </div>);
};

const WelcomeMessage = ({ onBackClick }) => {
    const[tp1,st1]=useState(''); const[tp2,st2]=useState(''); const[backLinkTyped, setBackLinkTyped] = useState('');
    const[cc_cursor,scc_cursor]=useState('\u00A0'); 
    const[cp_phase,scp_phase]=useState('initial_delay'); 
    const animTimeoutRef_welcome = useRef(null);
    const localScheduleFn_welcome = useCallback((h,d)=>scheduleAnimation(animTimeoutRef_welcome,h,d),[]);
    
    useEffect(()=>{
        if(DEBUG_LOGS) console.log(`[Welcome] Phase: ${cp_phase}, Cursor: "${cc_cursor}"`);
        let scheduled = false; const scheduleOnce = (h,d)=>{if(!scheduled){localScheduleFn_welcome(h,d);scheduled=true;}};
        if(cp_phase==='initial_delay'){scheduleOnce(()=>{scc_cursor(WELCOME_TEXT_PART_1[0]||'\u00A0');scp_phase('typing_part1');},PAUSE_BEFORE_WELCOME_MESSAGE_TYPING_MS);}
        else if(cp_phase==='typing_part1'){ if(tp1.length<WELCOME_TEXT_PART_1.length){ const n=tp1.length;const r=WELCOME_TEXT_PART_1[n]; let charDelay = WELCOME_CHAR_MIN_DELAY_MS; if(r===' ') charDelay += WELCOME_PAUSE_AFTER_SPACE_MS; else if(r==='\n') charDelay += WELCOME_PAUSE_AFTER_LINE_BREAK_MS; else if(PUNCTUATION_CHARS.includes(r)) charDelay += WELCOME_PAUSE_AFTER_PUNCTUATION_MS; else { charDelay += Math.random() * (BASE_HUMAN_MAX_DELAY_MS - BASE_HUMAN_MIN_DELAY_MS); } const s = charDelay / WELCOME_PART1_SPEED_MULTIPLIER; if(n===0&&(cc_cursor!==r||cc_cursor==='\u00A0'))scc_cursor(r||'\u00A0'); scheduleOnce(()=>{st1(e=>e+r);scc_cursor(n+1<WELCOME_TEXT_PART_1.length?WELCOME_TEXT_PART_1[n+1]:r);}, Math.max(10, s)); } else {scc_cursor(WELCOME_TEXT_PART_2[0]||'\u00A0');scp_phase('typing_part2');} } 
        else if(cp_phase==='typing_part2'){ if(tp2.length<WELCOME_TEXT_PART_2.length){ const n=tp2.length;const r=WELCOME_TEXT_PART_2[n]; let charDelay = WELCOME_CHAR_MIN_DELAY_MS; if(r===' ') charDelay += WELCOME_PAUSE_AFTER_SPACE_MS; else if(r==='\n') charDelay += WELCOME_PAUSE_AFTER_LINE_BREAK_MS; else if(PUNCTUATION_CHARS.includes(r)) charDelay += WELCOME_PAUSE_AFTER_PUNCTUATION_MS; else { charDelay += Math.random() * (BASE_HUMAN_MAX_DELAY_MS - BASE_HUMAN_MIN_DELAY_MS); } const s = charDelay / WELCOME_MESSAGE_SPEED_MULTIPLIER; if(n===0&&(cc_cursor!==r||cc_cursor==='\u00A0'))scc_cursor(r||'\u00A0'); scheduleOnce(()=>{st2(e=>e+r);scc_cursor(n+1<WELCOME_TEXT_PART_2.length?WELCOME_TEXT_PART_2[n+1]:r);},Math.max(10,s)); } else {scc_cursor(BACK_LINK_TEXT[0] || '\u00A0'); scp_phase('typing_back_link');} } 
        else if(cp_phase==='typing_back_link'){ if(backLinkTyped.length < BACK_LINK_TEXT.length){ const n=backLinkTyped.length; const r=BACK_LINK_TEXT[n]; let charDelay = WELCOME_CHAR_MIN_DELAY_MS; const s = charDelay / WELCOME_MESSAGE_SPEED_MULTIPLIER; if(n===0&&(cc_cursor!==r||cc_cursor==='\u00A0'))scc_cursor(r||'\u00A0'); scheduleOnce(()=>{setBackLinkTyped(prev=>prev+r); scc_cursor( n+1 < BACK_LINK_TEXT.length ? BACK_LINK_TEXT[n+1] : r);}, Math.max(10,s)); } else { scheduleOnce(()=>scp_phase('finished'), PAUSE_AFTER_TYPING_MS); } } 
        return()=>clearTimeout(animTimeoutRef_welcome.current);
    },[tp1,tp2,backLinkTyped,cc_cursor,cp_phase,localScheduleFn_welcome]);
    
    let d1_disp = tp1, d2_disp = tp2, dBackLink_disp = backLinkTyped, cursorChar_disp = cc_cursor;
    let isCursorInSmallWrapper = false, showWJ_main = false, showWJ_small_before_cursor = false, showWJ_between_d2_and_backlink = false;

    if (cp_phase === 'initial_delay') { d1_disp = ''; d2_disp = ''; dBackLink_disp = ''; cursorChar_disp = '\u00A0';
    } else if (cp_phase === 'finished') {
        if (backLinkTyped.length > 0 && backLinkTyped === BACK_LINK_TEXT) { dBackLink_disp = backLinkTyped.slice(0, -1); cursorChar_disp = backLinkTyped.slice(-1); } 
        else if (tp2.length > 0 && tp2 === WELCOME_TEXT_PART_2) { d2_disp = tp2.slice(0, -1); cursorChar_disp = tp2.slice(-1); } 
        else if (tp1.length > 0 && tp1 === WELCOME_TEXT_PART_1) { d1_disp = tp1.slice(0, -1); cursorChar_disp = tp1.slice(-1); }
    } else { 
        if (cp_phase === 'typing_part1' && tp1.endsWith(cc_cursor) && !['\u00A0', ' ', '\n'].includes(cc_cursor)) { d1_disp = tp1.slice(0, -1); }
        if (cp_phase === 'typing_part2' && tp2.endsWith(cc_cursor) && !['\u00A0', ' ', '\n'].includes(cc_cursor)) { d2_disp = tp2.slice(0, -1); }
        if (cp_phase === 'typing_back_link' && backLinkTyped.endsWith(cc_cursor) && !['\u00A0', ' ', '\n'].includes(cc_cursor)) { dBackLink_disp = backLinkTyped.slice(0, -1); }
    }
    
    isCursorInSmallWrapper = cp_phase === 'typing_part2' || cp_phase === 'typing_back_link' || (cp_phase === 'finished' && (tp2.length > 0 || backLinkTyped.length > 0));
    if (!isCursorInSmallWrapper && d1_disp.trim().length > 0 && cursorChar_disp && !['\u00A0', ' ', '\n'].includes(cursorChar_disp) ) { showWJ_main = true; }
    if (isCursorInSmallWrapper && cursorChar_disp && !['\u00A0', ' ', '\n'].includes(cursorChar_disp)) {
        if (cp_phase === 'typing_part2' || (cp_phase === 'finished' && tp2.length > 0 && backLinkTyped.length === 0) ) { if (d2_disp.trim().length > 0) showWJ_small_before_cursor = true; } 
        else if (cp_phase === 'typing_back_link' || (cp_phase === 'finished' && backLinkTyped.length > 0)) { if (dBackLink_disp.trim().length > 0) showWJ_small_before_cursor = true; else if (d2_disp.trim().length > 0) showWJ_small_before_cursor = true; }
    }
    if (d2_disp.trim().length > 0 && (cp_phase === 'typing_back_link' || (cp_phase === 'finished' && backLinkTyped.length > 0 && dBackLink_disp.trim().length > 0 ))) { showWJ_between_d2_and_backlink = true; }

    return(<div className="typewriter-base welcome-message-container">
        {renderStyledText(d1_disp, TEXT_HIGHLIGHTS_PART1)}
        {!isCursorInSmallWrapper && showWJ_main && '\u2060'}
        {!isCursorInSmallWrapper && cursorChar_disp && cp_phase !== 'initial_delay' && (<span className={`cursor ${cursorChar_disp==='\u00A0'||cursorChar_disp===' '||cursorChar_disp==='\n'?'empty-char':''}`}>{cursorChar_disp===' '||cursorChar_disp==='\n'?'\u00A0':cursorChar_disp}</span>)}
        {(tp2 || cp_phase === 'typing_part2' || cp_phase === 'typing_back_link' || (cp_phase === 'finished' && (WELCOME_TEXT_PART_2.length > 0 || BACK_LINK_TEXT.length > 0))) &&
            <span className="typewriter-small-text-wrapper">
                {renderStyledText(d2_disp, LINK_DEFINITIONS_PART2)}
                {showWJ_between_d2_and_backlink && '\u2060'}
                {(cp_phase === 'typing_back_link' || (cp_phase === 'finished' && backLinkTyped.length > 0)) ? <a href="#" onClick={(e) => { e.preventDefault(); onBackClick(); }} className="back-link">{dBackLink_disp}</a> : null}
                {isCursorInSmallWrapper && showWJ_small_before_cursor && '\u2060'}
                {isCursorInSmallWrapper && cursorChar_disp && (<span className={`cursor ${cursorChar_disp==='\u00A0'||cursorChar_disp===' '||cursorChar_disp==='\n'?'empty-char':''}`}>{cursorChar_disp===' '||cursorChar_disp==='\n'?'\u00A0':cursorChar_disp}</span>)}
            </span>
        }
        {cp_phase === 'initial_delay' && cursorChar_disp === '\u00A0' && (<span className={`cursor empty-char`}>{' '}</span>)}
    </div>);
};

const App = () => {
    const [currentView, setCurrentView] = useState('introLoop');
    const [triggerIntroLoopFullErase, setTriggerIntroLoopFullErase] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [isButtonWrapperVisible, setIsButtonWrapperVisible] = useState(false);
    const [shuffledStatements, setShuffledStatements] = useState([]);

    const MOBILE_BREAKPOINT = 768; 

    useEffect(() => {
        const calculateAndSetFontSize = () => {
            if (window.innerWidth > MOBILE_BREAKPOINT) { 
                const navElement = document.getElementById('main-nav');
                const navHeight = navElement ? navElement.offsetHeight : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height').replace('px','')) || 50;
                
                const appContainerElement = document.querySelector('.app-container');
                let appContainerPaddingTop = 32; 
                let appContainerPaddingBottom = 32;

                if (appContainerElement) {
                    const styles = getComputedStyle(appContainerElement);
                    appContainerPaddingTop = parseFloat(styles.paddingTop);
                    appContainerPaddingBottom = parseFloat(styles.paddingBottom);
                }
                
                const availableHeightForAppContent = window.innerHeight - navHeight - appContainerPaddingTop - appContainerPaddingBottom;

                // MODIFIED: Default desktop font size calculations & pill radius
                let newSize = 48; 
                let newSmallSize = 24;
                let newPillRadius = "17px"; 

                if (availableHeightForAppContent < 300) { 
                    newSize = 24; newSmallSize = 14; newPillRadius = "7px";
                } else if (availableHeightForAppContent < 500) { 
                    newSize = 32; newSmallSize = 16; newPillRadius = "7px";
                } else if (availableHeightForAppContent < 700) { 
                    newSize = 40; newSmallSize = 20; newPillRadius = "7px"; 
                }
                
                document.documentElement.style.setProperty('--typewriter-font-size', `${newSize}pt`);
                document.documentElement.style.setProperty('--typewriter-small-font-size', `${newSmallSize}pt`);
                document.documentElement.style.setProperty('--pill-border-radius', newPillRadius);
            } else {
                document.documentElement.style.removeProperty('--typewriter-font-size');
                document.documentElement.style.removeProperty('--typewriter-small-font-size');
                document.documentElement.style.removeProperty('--pill-border-radius');
            }
        };

        calculateAndSetFontSize();
        window.addEventListener('resize', calculateAndSetFontSize);
        return () => {
            window.removeEventListener('resize', calculateAndSetFontSize);
        };
    }, []);


    useEffect(() => { if (currentView === 'introLoop') { const statementsCopy = [...ORIGINAL_STATEMENTS]; for (let i = statementsCopy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [statementsCopy[i], statementsCopy[j]] = [statementsCopy[j], statementsCopy[i]]; } setShuffledStatements(statementsCopy); } }, [currentView]);
    const handleStartTransition=useCallback(()=>{setShowButton(false);setTriggerIntroLoopFullErase(true);},[]);
    const handleIntroEraseComplete=useCallback(()=>{setTriggerIntroLoopFullErase(false);setCurrentView('welcomeMessage');},[]);
    const handleBackNavigation = useCallback(() => {setCurrentView('introLoop');setTriggerIntroLoopFullErase(false); setShowButton(true); setIsButtonWrapperVisible(false);}, []);
    const handleFirstStatementCompletedApp = useCallback(() => { setIsButtonWrapperVisible(true);}, []);

    return(<div className="app-container">
        {currentView==='introLoop'&& shuffledStatements.length > 0 && (<IntroLoopTypewriter statementsList={shuffledStatements} startFullErase={triggerIntroLoopFullErase} onFullEraseComplete={handleIntroEraseComplete} onFirstStatementLoopCycleComplete={handleFirstStatementCompletedApp} />)}
        {currentView==='welcomeMessage'&&<WelcomeMessage onBackClick={handleBackNavigation} />}
        {showButton&&<ImagineButton onClick={handleStartTransition} isVisible={isButtonWrapperVisible} />}
    </div>);
};
ReactDOM.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>,
    document.getElementById('root')
);
