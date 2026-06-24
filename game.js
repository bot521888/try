 (function () {
   'use strict';
  // ========== 可调参数集中配置 ==========
  const config = {
    width: 800,
     height: 400,
     groundY: 320,

     // 玩家
     playerSpeed: 280,
     jumpForce: -420,
     gravity: 1200,
     playerWidth: 48,
     playerHeight: 80,
    playerMaxHp: 100,
    /** Versus 1v1：生命上限 = playerMaxHp × 此项（无养成加成时抬高对局血量） */
    versusMaxHpMul: 1.55,
    /** Versus：普通格挡（非完美弹反）防守方每次按生命上限比例扣血 */
    versusBlockHpLossRatio: 0.25,
    /** 完美弹反：攻击方 / 敌人按自身生命上限比例掉血；防守方不掉血 */
    perfectParryAttackerHpRatio: 0.25,
    playerDodgeCooldown: 1, // 闪避（Shift）冷却，秒

     // 玩家攻击
     attackDamage: 15,
     attackRange: 70,
     attackDuration: 200,
     attackCooldown: 250, // Minecraft 式节奏：0.25s 一次攻击

     // 普通敌人
     enemyWidth: 48,
     enemyHeight: 80,
     enemyMaxHp: 80,
     enemyWalkSpeed: 80,
     enemyKnockbackSpeed: 350,   // 旧击退速度（保留以兼容 buff 函数）
     enemyKnockbackDuration: 150, // 旧击退时长（ms，已被新系统替代）
     baseKnockbackX: 300,
     momentumFactor: 0.8,
     maxKnockbackVx: 800,
     attackDash: 120,
     knockbackY: 120,
     hitstun: 0.12,      // 行为受控时间（敌人处于受击状态）
     hurtCooldown: 0.12, // 在此期间忽略新命中，避免抖动
     groundFriction: 0.88, // 地面摩擦：击退后滑一下停

    // 精英敌人
    eliteMaxHp: 200,
    eliteWalkSpeed: 60,

    // 远程敌人
    rangedMaxHp: 60,
    rangedKeepDistance: 260,
    rangedWalkSpeed: 60,
    projectileSpeed: 260,
    projectileInterval: 2.5,
    projectileDamage: 6,

    // AI 类型 A（近战压迫型）
    typeAAttackRange: 55,
    typeAAttackDuration: 0.4,
    typeARecoverDuration: 0.3,
    typeAWalkSpeed: 80,
    enemyAttackDamage: 8,

    // AI 类型 B（远程型）— 沿用 ranged 相关配置，仅需 recover
    typeBRecoverDuration: 0.2,

    // AI 类型 C（冲锋型）
    typeCChargeInterval: 3,
    typeCWindupDuration: 0.5,
    typeCChargeSpeed: 420,
    typeCChargeDuration: 0.4,
    typeCRecoverDuration: 0.4,
    typeCWalkSpeed: 70,

    // Boss（单一体，50% 血进入阶段2）；基础血/攻为原先约 1/5，难度与首通倍率仍照常叠乘
    bossWidth: 72,
    bossHeight: 120,
    bossMaxHp: 80,
    bossWalkSpeed: 90,
    bossAttackWindup: 0.4,
    bossComboInterval: 0.18,
    bossComboHits: 3,
    bossAttackCooldown: 2.2,
    bossAttackDamage: 2.4,
    bossChargeWindup: 0.25,
    bossChargeSpeed: 520,
    bossChargeDuration: 0.5,
    bossChargeCooldown: 4,
    bossAoeWindup: 0.4,
    bossAoeRadius: 120,
    bossAoeDuration: 0.6,
    bossAoeCooldown: 6,
    bossAoeDamage: 3,
    bossPhase2SpeedScale: 1.2,
    bossEnragedShakeDuration: 400,
    bossEnragedLabelDuration: 1.5,

    // 打击感
    hitstopMs: 80,
    screenShakeAmount: 8,
    screenShakeDuration: 100,
    /** 击杀/剑气等额外震屏的强度上限（像素量级） */
    screenShakeKillBossAmp: 14,
    screenShakeKillMobAmp: 6,
    screenShakeSwordQiAmp: 4.5,

    // 摄像机（lerp 跟随速度，越大越快）
    cameraLerpSpeed: 6,

    // 视差背景
    parallaxFar: 0.2,
    parallaxMid: 0.5,
    parallaxFog: 0.1,
    parallaxNear: 0,
    playerStartX: 120,

    // 玩家攻击判定 X 方向微调（>0 时整体稍向前偏一点）
    attackOffsetX: 0,
    // 玩家 / 敌人受击箱左右收缩
    // 玩家保留完整宽度，敌人略微缩进，让框完全落在身体里
    playerHitboxInsetX: 0,
    enemyHitboxInsetX: 5,

    // 主角跑步 spritesheet（横向 6 帧，84×17 → 每帧 14×17）
    runSheetPath: 'assets/sprites/Character/Run/Character_side_run-Sheet6.png',
    runSheetFrames: 6,
    runFrameW: 14,
    runFrameH: 17,
    runFps: 12,
    runDrawScale: 5,
    playerRunOffsetX: 0,
    playerRunOffsetY: 0,
    // 主角站立 spritesheet（72×16 → 每帧 12×16）
    idleSheetPath: 'assets/sprites/Character/idle/Character_side_idle-Sheet6.png',
    idleSheetFrames: 6,
    idleFrameW: 12,
    idleFrameH: 16,
    idleFps: 7,
    idleDrawScale: 5,
    playerIdleOffsetX: 0,
    playerIdleOffsetY: 0,
    // 主角出拳 spritesheet（80×18 → 每帧 20×18）
    punchSheetPath: 'assets/PostApocalypse_AssetPack_v1.1.2/Character/Main/Punch/Character_side_punch-Sheet4.png',
    punchFrames: 4,
    punchFrameW: 20,
    punchFrameH: 18,
    punchFps: 16,
    punchDrawScale: 5,
    playerPunchOffsetX: 0,
    playerPunchOffsetY: 0,

    // 主角死亡 spritesheet（126×16 → 每帧 21×16）
    deathSheetPath: 'assets/sprites/Character/Death/Character_side_death1-Sheet6.png',
    deathFrames: 6,
    deathFrameW: 21,
    deathFrameH: 16,
    deathFps: 11,
    deathDrawScale: 5,
    playerDeathOffsetX: 0,
    playerDeathOffsetY: 0,
  };

  // ========== 超级拳 spritesheet 资源 ==========
  const testSprite = new Image();
  testSprite.src = 'assets/sprites/Enemies/Zombie_Axe_Side_Idle-Sheet6.png';
  testSprite.onload = () => console.log("Idle 加载成功！路径对了");
  testSprite.onerror = () => console.log("Idle 加载失败！路径或文件错");

  const superAttackSprite = new Image();
  superAttackSprite.src = 'assets/Bat_side_attack-Sheet4.png';  // 如果你在 assets/sprites 里，就改成 'assets/sprites/Bat_side_attack-Sheet4.png'

  // ========== 背景图片 ==========
  const sceneBg = new Image();
  sceneBg.src = 'assets/back/back g/orig_big.png';
  /** 第二关荒原背景（assets/level2_wasteland_bg.png） */
  const sceneBgLevel2 = new Image();
  sceneBgLevel2.src = 'assets/level2_wasteland_bg.png';

  // ========== 敌人流血动画资源（shot sprites） ==========
  const bleedShot1Sprite = new Image();
  bleedShot1Sprite.src = 'assets/sprites/shot/shot_1-Sheet3.png';
  const bleedShot2Sprite = new Image();
  bleedShot2Sprite.src = 'assets/sprites/shot/shot_2-Sheet3.png';

  /** 天使降临：女（默认朝左，敌人在右时水平翻转） */
  const angelFlyFemaleSprite = new Image();
  angelFlyFemaleSprite.src = 'assets/fly/Z7eSP-removebg-preview.png';
  /** 天使降临：男（默认朝右，敌人在左时水平翻转） */
  const angelFlyMaleSprite = new Image();
  angelFlyMaleSprite.src = 'assets/fly/z0qOP-removebg-preview.png';

  /** 武林高手：降龙十八掌能量龙 */
  const xianglongDragonSprite = new Image();
  xianglongDragonSprite.src = 'assets/effects/xl18z-dragon-sprite.png';

  // ========== 背景道具（assets/back/obj） ==========
  const bgBench = new Image();
  bgBench.src = 'assets/back/obj/Bench_2_down_Overgrown_Dark-Green.png';
  const bgStreetLight = new Image();
  bgStreetLight.src = 'assets/back/obj/Street-Light_1_Side.png';
  const bgGarbageBin = new Image();
  bgGarbageBin.src = 'assets/back/obj/Garbage-Bin_1.png';
  const bgStopSign = new Image();
  bgStopSign.src = 'assets/back/obj/Stop-sign_Down_2_Overgrown_Dark-Green.png';
  const bgTrashCan = new Image();
  bgTrashCan.src = 'assets/back/obj/Trash-can_2.png';
  const bgTrafficCone = new Image();
  bgTrafficCone.src = 'assets/back/obj/Traffic-cone.png';
  const BG_PROP_SCALE = 4;

  const bleedFrameMs = 120; // 每帧 120ms
  const bleedShotFrames = [3, 3]; // shot_1 / shot_2 都是 Sheet3

  // ========== 图片加载助手（支持多路径回退） ==========
  function setImageWithFallback(img, paths) {
    let idx = 0;
    const tryNext = () => {
      if (idx >= paths.length) return;
      img.src = paths[idx++];
    };
    img.onerror = () => {
      if (idx < paths.length) tryNext();
    };
    tryNext();
  }

  /** 从路径解析 -SheetN.png 的帧数（Zombie_Axe 用） */
  function parseAxeSheetFrameCount(path) {
    const m = String(path).match(/-Sheet(\d+)\.png$/i);
    return m ? parseInt(m[1], 10) : null;
  }

  /** Zombie_Axe：多路径回退，成功时写入 img._axeFrameCount，可选 onLoaded/onFailed */
  function setAxeImageWithFallback(img, paths, opts) {
    let idx = 0;
    const tryNext = () => {
      if (idx >= paths.length) {
        img.onerror = null;
        img.onload = null;
        if (opts && typeof opts.onFailed === 'function') opts.onFailed();
        return;
      }
      const path = paths[idx++];
      img.onerror = () => tryNext();
      img.onload = () => {
        const n = parseAxeSheetFrameCount(path);
        if (n && n > 0) img._axeFrameCount = n;
        if (opts && typeof opts.onLoaded === 'function') opts.onLoaded(path);
      };
      img.src = path;
    };
    tryNext();
  }

  const AXE_ENEMY_DIRS = ['sprites/Enemies/', './sprites/Enemies/'];
  function withAxeDirs(filename) {
    const out = [];
    for (const dir of AXE_ENEMY_DIRS) out.push(`${dir}${filename}`);
    return out;
  }
  /** 按优先级尝试多种 Sheet 帧数 + Side / 非 Side 文件名 */
  function axeVariantPaths(middleSegment) {
    const nums = [6, 8, 4, 10, 11, 12, 9, 7, 5];
    const out = [];
    for (const n of nums) {
      out.push(...withAxeDirs(`Zombie_Axe_Side_${middleSegment}-Sheet${n}.png`));
    }
    for (const n of nums) {
      out.push(...withAxeDirs(`Zombie_Axe_${middleSegment}-Sheet${n}.png`));
    }
    return out;
  }

  // ========== 敌人动画资源（应用到所有怪物，含 Boss） ==========
  const enemyIdleSprite = new Image();
  setImageWithFallback(enemyIdleSprite, [
    'assets/sprites/enemy/Zombie_Small_Side_Idle-Sheet6.png',
    'assets/enemy/Zombie_Small_Side_Idle-Sheet6.png',
    'assets/Zombie_Small_Side_Idle-Sheet6.png',
  ]);
  const enemyWalkSprite = new Image();
  setImageWithFallback(enemyWalkSprite, [
    'assets/sprites/enemy/Zombie_Small_Side_Walk-Sheet6.png',
    'assets/enemy/Zombie_Small_Side_Walk-Sheet6.png',
    'assets/Zombie_Small_Side_Walk-Sheet6.png',
  ]);
  const enemyAttack1Sprite = new Image();
  setImageWithFallback(enemyAttack1Sprite, [
    'assets/sprites/enemy/Zombie_Small_Side_First-Attack-Sheet4.png',
    'assets/enemy/Zombie_Small_Side_First-Attack-Sheet4.png',
    'assets/Zombie_Small_Side_First-Attack-Sheet4.png',
  ]);
  const enemyAttack2Sprite = new Image();
  setImageWithFallback(enemyAttack2Sprite, [
    'assets/sprites/enemy/Zombie_Small_Side_Second-Attack-Sheet11.png',
    'assets/enemy/Zombie_Small_Side_Second-Attack-Sheet11.png',
    'assets/Zombie_Small_Side_Second-Attack-Sheet11.png',
  ]);
  const enemyDeathSprite = new Image();
  setImageWithFallback(enemyDeathSprite, [
    'assets/sprites/enemy/Zombie_Small_Side_First-Death-Sheet6.png',
    'assets/enemy/Zombie_Small_Side_First-Death-Sheet6.png',
    'assets/Zombie_Small_Side_First-Death-Sheet6.png',
  ]);

  const enemySheetDefs = {
    idle:   { img: enemyIdleSprite,    frames: 6, loop: true,  frameMs: 130 },
    walk:   { img: enemyWalkSprite,    frames: 6, loop: true,  frameMs: 110 },
    attack1:{ img: enemyAttack1Sprite, frames: 4, loop: false, frameMs: 100 },
    attack2:{ img: enemyAttack2Sprite, frames: 11, loop: false, frameMs: 100 },
    hurt:   { img: enemyAttack1Sprite, frames: 4, loop: false, frameMs: 100 }, // 无 hurt 贴图，用 attack1 代替
    death:  { img: enemyDeathSprite,   frames: 6, loop: false, frameMs: 120 },
  };

  // ========== 第二关新怪物（使用你给的 Zombie 精灵表） ==========
  const secSpriteSheet = new Image();
  secSpriteSheet.src = 'assets/sprites/sec/Zombie.png'; // 416x192, 32x32 帧, 13 列
  const secSpriteMeta = { frameWidth: 32, frameHeight: 32, cols: 13 };
  const secSpriteAnimations = {
    idle:   { startFrame: 0,  frameCount: 8, fps: 7,  loop: true },
    walk:   { startFrame: 13, frameCount: 8, fps: 10, loop: true },
    attack1:{ startFrame: 26, frameCount: 8, fps: 11, loop: false },
    attack2:{ startFrame: 26, frameCount: 8, fps: 11, loop: false },
    hurt:   { startFrame: 39, frameCount: 6, fps: 11, loop: false },
    death:  { startFrame: 52, frameCount: 8, fps: 9,  loop: false },
  };

  function isMiniZombie(enemy) {
    return enemy && enemy.type === 'melee' && !enemy.isBoss;
  }
  function isSecEnemy(enemy) {
    return enemy && enemy.type === 'sec' && !enemy.isBoss;
  }
  function isAxeEnemy(enemy) {
    // 关卡中型怪（Zombie_Axe / elite / charge）统一走 Axe 动画分支
    return enemy && !enemy.isBoss && (
      enemy.type === 'Zombie_Axe' ||
      enemy.type === 'elite' ||
      enemy.type === 'charge'
    );
  }

  // ========== Zombie_Axe 动画资源（写死精确文件名） ==========
  function loadAxeSprite(src, opts = {}) {
    const img = new Image();
    img.onload = () => {
      console.log("Loaded: " + src);
      if (typeof opts.onLoaded === 'function') opts.onLoaded();
    };
    img.onerror = () => console.log("Failed: " + src);
    img.src = src;
    return img;
  }

  const axeIdleSrc = 'assets/sprites/Enemies/Zombie_Axe_Side_Idle-Sheet6.png';
  const axeWalkSrc = 'assets/sprites/Enemies/Zombie_Axe_Side_Walk-Sheet8.png';
  const axeFirstAttackSrc = 'assets/sprites/Enemies/Zombie_Axe_Side_First-Attack-Sheet7.png';
  const axeSecondAttackSrc = 'assets/sprites/Enemies/Zombie_Axe_Side_Second-Attack-Sheet9.png';
  const axeDeathSrc = 'assets/sprites/Enemies/Zombie_Axe_Side_First-Death-Sheet6.png';

  const axeLeftIdleSrc = 'assets/sprites/Enemies/Zombie_Axe_Side-left_Idle-Sheet6.png';
  const axeLeftWalkSrc = 'assets/sprites/Enemies/Zombie_Axe_Side-left_Walk-Sheet8.png';
  const axeLeftFirstAttackSrc = 'assets/sprites/Enemies/Zombie_Axe_Side-left_First-Attack-Sheet7.png';
  const axeLeftSecondAttackSrc = 'assets/sprites/Enemies/Zombie_Axe_Side-left_Second-Attack-Sheet9.png';
  const axeLeftDeathSrc = 'assets/sprites/Enemies/Zombie_Axe_Side-left_First-Death-Sheet6.png';

  const axeIdleSprite = loadAxeSprite(axeIdleSrc, {
    onLoaded: () => console.log("Loaded Zombie_Axe idle: " + axeIdleSrc),
  });
  console.log("Loading Zombie_Axe_Idle: " + axeIdleSprite.src);
  const axeWalkSprite = loadAxeSprite(axeWalkSrc);
  const axeFirstAttackSprite = loadAxeSprite(axeFirstAttackSrc);
  const axeSecondAttackSprite = loadAxeSprite(axeSecondAttackSrc);
  const axeDeathSprite = loadAxeSprite(axeDeathSrc);

  // left 翻转版（存在则优先使用，不存在则镜像）
  const axeLeftIdleSprite = loadAxeSprite(axeLeftIdleSrc);
  const axeWalkLeftSprite = loadAxeSprite(axeLeftWalkSrc);
  const axeFirstAttackLeftSprite = loadAxeSprite(axeLeftFirstAttackSrc);
  const axeSecondAttackLeftSprite = loadAxeSprite(axeLeftSecondAttackSrc);
  const axeDeathLeftSprite = loadAxeSprite(axeLeftDeathSrc);

  function getAxeFrameCount(def, img) {
    if (img && img._axeFrameCount) return img._axeFrameCount;
    return def && def.frames ? def.frames : 6;
  }

  /** 朝左时优先用 left 贴图（已加载），否则镜像默认贴图 */
  function getAxeSheetImage(def, enemy) {
    if (!def) return { img: null, mirror: false };
    const leftImg = def.imgLeft;
    if (enemy.facing === -1 && leftImg && leftImg.complete && leftImg.naturalWidth > 0) {
      return { img: leftImg, mirror: false };
    }
    const img = def.img;
    return { img, mirror: enemy.facing === -1 };
  }

  const axeSheetDefs = {
    idle: {
      img: axeIdleSprite,
      imgLeft: axeLeftIdleSprite,
      frames: 6,
      loop: true,
      frameMs: 120,
    },
    walk: {
      img: axeWalkSprite,
      imgLeft: axeWalkLeftSprite,
      frames: 8,
      loop: true,
      frameMs: 120,
    },
    attack1: {
      img: axeFirstAttackSprite,
      imgLeft: axeFirstAttackLeftSprite,
      frames: 7,
      loop: false,
      frameMs: 120,
    },
    attack2: {
      img: axeSecondAttackSprite,
      imgLeft: axeSecondAttackLeftSprite,
      frames: 9,
      loop: false,
      frameMs: 120,
    },
    hurt: {
      img: axeFirstAttackSprite,
      imgLeft: axeFirstAttackLeftSprite,
      frames: 7,
      loop: false,
      frameMs: 120,
    },
    death: {
      img: axeDeathSprite,
      imgLeft: axeDeathLeftSprite,
      frames: 6,
      loop: false,
      frameMs: 120,
    },
  };

  // ========== Zombie_Big（Boss）动画资源 ==========
  const bossIdleSprite = new Image();
  bossIdleSprite.src = 'assets/sprites/big/Zombie_Big_Side_Idle-Sheet6.png';
  const bossIdleLeftSprite = new Image();
  bossIdleLeftSprite.src = 'assets/sprites/big/Zombie_Big_Side-left_Idle-Sheet6.png';

  const bossWalkSprite = new Image();
  bossWalkSprite.src = 'assets/sprites/big/Zombie_Big_Side_Walk-Sheet8.png';
  const bossWalkLeftSprite = new Image();
  bossWalkLeftSprite.src = 'assets/sprites/big/Zombie_Big_Side-left_Walk-Sheet8.png';

  const bossFirstAttackSprite = new Image();
  bossFirstAttackSprite.src = 'assets/sprites/big/Zombie_Big_Side_First-Attack-Sheet8.png';
  const bossFirstAttackLeftSprite = new Image();
  bossFirstAttackLeftSprite.src = 'assets/sprites/big/Zombie_Big_Side-left_First-Attack-Sheet8.png';

  const bossSecondAttackSprite = new Image();
  bossSecondAttackSprite.src = 'assets/sprites/big/Zombie_Big_Side_Second-Attack-Sheet15.png';
  const bossSecondAttackLeftSprite = new Image();
  bossSecondAttackLeftSprite.src = 'assets/sprites/big/Zombie_Big_Side-left_Second-Attack-Sheet15.png';

  const bossFirstDeathSprite = new Image();
  bossFirstDeathSprite.src = 'assets/sprites/big/Zombie_Big_Side_First-Death-Sheet7.png';
  const bossFirstDeathLeftSprite = new Image();
  bossFirstDeathLeftSprite.src = 'assets/sprites/big/Zombie_Big_Side-left_First-Death-Sheet7.png';

  const bossSecondDeathSprite = new Image();
  bossSecondDeathSprite.src = 'assets/sprites/big/Zombie_Big_Side_Second-Death-Sheet8.png';
  const bossSecondDeathLeftSprite = new Image();
  bossSecondDeathLeftSprite.src = 'assets/sprites/big/Zombie_Big_Side-left_Second-Death-Sheet8.png';

  function getBossSheetImage(def, enemy) {
    if (!def) return { img: null, mirror: false };
    if (enemy.facing === -1 && def.imgLeft && def.imgLeft.complete && def.imgLeft.naturalWidth > 0) {
      return { img: def.imgLeft, mirror: false };
    }
    const img = def.img;
    return { img, mirror: enemy.facing === -1 };
  }

  const bossSheetDefs = {
    idle: {
      img: bossIdleSprite,
      imgLeft: bossIdleLeftSprite,
      frames: 6,
      loop: true,
      frameMs: 120,
    },
    run: {
      img: bossWalkSprite,
      imgLeft: bossWalkLeftSprite,
      frames: 8,
      loop: true,
      frameMs: 120,
    },
    attack1: {
      img: bossFirstAttackSprite,
      imgLeft: bossFirstAttackLeftSprite,
      frames: 8,
      loop: false,
      frameMs: 120,
    },
    attack2: {
      img: bossSecondAttackSprite,
      imgLeft: bossSecondAttackLeftSprite,
      frames: 15,
      loop: false,
      frameMs: 120,
    },
    hurt: {
      img: bossFirstAttackSprite,
      imgLeft: bossFirstAttackLeftSprite,
      frames: 8,
      loop: false,
      frameMs: 120,
    },
    death1: {
      img: bossFirstDeathSprite,
      imgLeft: bossFirstDeathLeftSprite,
      frames: 7,
      loop: false,
      frameMs: 120,
    },
    death2: {
      img: bossSecondDeathSprite,
      imgLeft: bossSecondDeathLeftSprite,
      frames: 8,
      loop: false,
      frameMs: 120,
    },
  };

  // ========== 渲染模式：无资源纯色方块 ==========
  // 设为 false：优先使用 spritesheet；当任何图片加载失败（img === null）时自动回退为彩色矩形
  const FORCE_RECT_RENDER = false;

  // ========== Debug 开关（按 H 键切换 hitbox/hurtbox 轮廓，便于校准贴图） ==========
  let DEBUG_HITBOX = false;

  // ========== SpriteAnimator（横向切帧，支持 reset / playOnce / loop） ==========
  const SpriteAnimator = {
    img: null,
    frameW: 14,
    frameH: 17,
    frameCount: 6,
    fps: 12,
    mode: 'loop',   // 'loop' | 'playOnce'
    frameIndex: 0,
    elapsed: 0,
    finished: false,

    async load(src, opts = {}) {
      this.frameW = opts.frameW ?? 14;
      this.frameH = opts.frameH ?? 17;
      this.frameCount = opts.frameCount ?? 6;
      this.fps = opts.fps ?? 12;
      this.mode = opts.loop !== false ? 'loop' : 'playOnce';
      this.reset();
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.img = img;
            resolve(img);
          };
          img.onerror = () => {
            this.img = null;
            resolve(null);
          };
          img.src = url;
        });
      } catch (e) {
        this.img = null;
        return null;
      }
    },

    reset() {
      this.frameIndex = 0;
      this.elapsed = 0;
      this.finished = false;
    },

    loop() { this.mode = 'loop'; this.finished = false; },
    playOnce() { this.mode = 'playOnce'; this.reset(); },

    update(dt) {
      if (!this.img || this.frameCount <= 0 || this.finished) return;
      this.elapsed += dt;
      const frameTime = 1 / this.fps;
      while (this.elapsed >= frameTime) {
        this.elapsed -= frameTime;
        this.frameIndex += 1;
        if (this.frameIndex >= this.frameCount) {
          if (this.mode === 'loop') {
            this.frameIndex = 0;
          } else {
            this.frameIndex = this.frameCount - 1;
            this.finished = true;
            return;
          }
        }
      }
    },

    draw(ctx, x, y, { scale = 5, flipX = false, offsetX = 0, offsetY = 0 } = {}) {
      if (!this.img || this.frameCount <= 0) return;
      const sx = this.frameIndex * this.frameW;
      const sy = 0;
      const dw = this.frameW * scale;
      const dh = this.frameH * scale;
      ctx.save();
      if (flipX) {
        // 关键：翻转时以 x + dw 为原点对称，避免左右偏移
        ctx.translate(Math.round(x + dw), 0);
        ctx.scale(-1, 1);
        x = 0;
      }
      ctx.drawImage(
        this.img,
        sx, sy, this.frameW, this.frameH,
        Math.round(x + offsetX),
        Math.round(y + offsetY),
        dw, dh
      );
      ctx.restore();
    },
  };

  // 跑步 / 站立 / 出拳 / 死亡 动画实例
  let runSprite = null;
  let idleSprite = null;
  let punchSprite = null;
  let deathSprite = null;
let runSpriteP2 = null;
let idleSpriteP2 = null;
let punchSpriteP2 = null;
let deathSpriteP2 = null;
  async function initRunSprite() {
    runSprite = Object.assign({}, SpriteAnimator);
    await runSprite.load(config.runSheetPath, {
      frameW: config.runFrameW,
      frameH: config.runFrameH,
      frameCount: config.runSheetFrames,
      fps: config.runFps,
      loop: true,
    });
  }
  async function initIdleSprite() {
    idleSprite = Object.assign({}, SpriteAnimator);
    await idleSprite.load(config.idleSheetPath, {
      frameW: config.idleFrameW,
      frameH: config.idleFrameH,
      frameCount: config.idleSheetFrames,
      fps: config.idleFps,
      loop: true,
    });
  }

  async function initPunchSprite() {
    punchSprite = Object.assign({}, SpriteAnimator);
    await punchSprite.load(config.punchSheetPath, {
      frameW: config.punchFrameW,
      frameH: config.punchFrameH,
      frameCount: config.punchFrames,
      fps: config.punchFps,
      loop: false, // 播放一次
    });
  }

  async function initDeathSprite() {
    deathSprite = Object.assign({}, SpriteAnimator);
    await deathSprite.load(config.deathSheetPath, {
      frameW: config.deathFrameW,
      frameH: config.deathFrameH,
      frameCount: config.deathFrames,
      fps: config.deathFps,
      loop: false, // 死亡只播一次
    });
  }

  // ========== 原有多动作 SpriteAnimator 模块（idle/run/jump/attack/hurt/dead） ==========
  // animations: { actionName: { startFrame, frameCount, fps, loop } }
  const MultiActionAnimator = {
    img: null,
    frameWidth: 48,
    frameHeight: 80,
    cols: 8,
    animations: {},
    currentAction: 'idle',
    frameIndex: 0,
    elapsed: 0,
    onEnd: null,

    async load(src, opts = {}) {
      this.frameWidth = opts.frameWidth ?? 48;
      this.frameHeight = opts.frameHeight ?? 80;
      this.cols = opts.cols ?? 8;
      this.animations = opts.animations ?? {};
      this.currentAction = 'idle';
      this.frameIndex = 0;
      this.elapsed = 0;
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.img = img;
            resolve(img);
          };
          img.onerror = () => {
            this.img = null;
            resolve(null);
          };
          img.src = url;
        });
      } catch (e) {
        this.img = null;
        return null;
      }
    },

    setPlaceholder(w, h, color) {
      const c = document.createElement('canvas');
      c.width = this.frameWidth * this.cols;
      c.height = this.frameHeight * Math.ceil(24 / this.cols);
      const ctx = c.getContext('2d');
      ctx.fillStyle = color;
      for (let i = 0; i < 24; i++) {
        const col = i % this.cols;
        const row = Math.floor(i / this.cols);
        ctx.fillRect(col * this.frameWidth + 2, row * this.frameHeight + 2, this.frameWidth - 4, this.frameHeight - 4);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.strokeRect(col * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight);
      }
      this.img = c;
    },

    play(action) {
      const def = this.animations[action];
      if (!def || (this.currentAction === action && def.loop)) return;
      this.currentAction = action;
      this.frameIndex = 0;
      this.elapsed = 0;
    },

    update(dt) {
      const def = this.animations[this.currentAction];
      if (!def) return;
      if (!def.loop && this.frameIndex >= def.frameCount - 1) return; // 非循环已播完，停在最后一帧
      this.elapsed += dt;
      const frameTime = 1 / def.fps;
      while (this.elapsed >= frameTime) {
        this.elapsed -= frameTime;
        this.frameIndex += 1;
        if (this.frameIndex >= def.frameCount) {
          if (def.loop) {
            this.frameIndex = 0;
          } else {
            this.frameIndex = def.frameCount - 1;
            if (this.onEnd) this.onEnd(this.currentAction);
            return;
          }
        }
      }
    },

    getCurrentAction() { return this.currentAction; },
    isFinished() {
      const def = this.animations[this.currentAction];
      return def && !def.loop && this.frameIndex >= def.frameCount - 1 && this.elapsed >= 1 / def.fps;
    },

    draw(ctx, x, y, facing, scaleW = 1, scaleH = 1) {
      const def = this.animations[this.currentAction];
      if (!def || !this.img) return;
      const idx = def.startFrame + this.frameIndex;
      const col = idx % this.cols;
      const row = Math.floor(idx / this.cols);
      const sw = this.frameWidth;
      const sh = this.frameHeight;
      const dw = sw * scaleW;
      const dh = sh * scaleH;
      ctx.save();
      ctx.translate(x, y);
      if (facing === -1) {
        ctx.translate(dw, 0);
        ctx.scale(-1, 1);
        ctx.translate(-dw, 0);
      }
      ctx.drawImage(this.img, col * sw, row * sh, sw, sh, 0, 0, dw, dh);
      ctx.restore();
    },
  };

  // 玩家动画配置：动作 -> { startFrame, frameCount, fps, loop }
  const playerAnimations = {
    idle:  { startFrame: 0,  frameCount: 4, fps: 8,  loop: true },
    run:   { startFrame: 4,  frameCount: 6, fps: 12, loop: true },
    jump:  { startFrame: 10, frameCount: 4, fps: 10, loop: true },
    attack:{ startFrame: 14, frameCount: 4, fps: 15, loop: false },
    hurt:  { startFrame: 18, frameCount: 2, fps: 12, loop: false },
    dead:  { startFrame: 20, frameCount: 3, fps: 8,  loop: false },
  };

  // 僵尸动画配置
  const zombieAnimations = {
    idle:  { startFrame: 0,  frameCount: 2, fps: 4,  loop: true },
    run:   { startFrame: 2,  frameCount: 4, fps: 8,  loop: true },
    jump:  { startFrame: 6,  frameCount: 2, fps: 6,  loop: true },
    attack:{ startFrame: 8,  frameCount: 3, fps: 10, loop: false },
    hurt:  { startFrame: 11, frameCount: 2, fps: 12, loop: false },
    dead:  { startFrame: 13, frameCount: 4, fps: 8,  loop: false },
  };

  // 创建独立的 SpriteAnimator 实例
  function createAnimator(opts) {
    const a = {
      img: null,
      frameWidth: opts.frameWidth ?? 48,
      frameHeight: opts.frameHeight ?? 80,
      cols: opts.cols ?? 8,
      animations: opts.animations ?? {},
      currentAction: 'idle',
      frameIndex: 0,
      elapsed: 0,
      onEnd: null,
    };
    a.load = MultiActionAnimator.load.bind(a);
    a.setPlaceholder = MultiActionAnimator.setPlaceholder.bind(a);
    a.play = MultiActionAnimator.play.bind(a);
    a.update = MultiActionAnimator.update.bind(a);
    a.draw = MultiActionAnimator.draw.bind(a);
    a.getCurrentAction = MultiActionAnimator.getCurrentAction.bind(a);
    return a;
  }

  let playerAnim = null;
  let zombieAnimData = null; // { img, frameWidth, frameHeight, cols, animations }
  async function initSpriteAnimators() {
    await initRunSprite();
    await initIdleSprite();
    await initPunchSprite();
    await initDeathSprite();
  runSpriteP2 = Object.assign({}, SpriteAnimator);
  await runSpriteP2.load(config.runSheetPath, {
    frameW: config.runFrameW,
    frameH: config.runFrameH,
    frameCount: config.runSheetFrames,
    fps: config.runFps,
    loop: true,
  });
  idleSpriteP2 = Object.assign({}, SpriteAnimator);
  await idleSpriteP2.load(config.idleSheetPath, {
    frameW: config.idleFrameW,
    frameH: config.idleFrameH,
    frameCount: config.idleSheetFrames,
    fps: config.idleFps,
    loop: true,
  });
  punchSpriteP2 = Object.assign({}, SpriteAnimator);
  await punchSpriteP2.load(config.punchSheetPath, {
    frameW: config.punchFrameW,
    frameH: config.punchFrameH,
    frameCount: config.punchFrames,
    fps: config.punchFps,
    loop: false,
  });
  deathSpriteP2 = Object.assign({}, SpriteAnimator);
  await deathSpriteP2.load(config.deathSheetPath, {
    frameW: config.deathFrameW,
    frameH: config.deathFrameH,
    frameCount: config.deathFrames,
    fps: config.deathFps,
    loop: false,
  });
    playerAnim = createAnimator({
      frameWidth: config.playerWidth,
      frameHeight: config.playerHeight,
      cols: 8,
      animations: playerAnimations,
    });
    await playerAnim.load('assets/player.png', { frameWidth: config.playerWidth, frameHeight: config.playerHeight, cols: 8, animations: playerAnimations });
    if (!playerAnim.img) {
      playerAnim.setPlaceholder(config.playerWidth, config.playerHeight, '#4ade80');
    }
    playerAnim.onEnd = (action) => {
      if (action === 'attack' || action === 'hurt') playerAnim.play('idle');
    };

    const z = createAnimator({
      frameWidth: config.enemyWidth,
      frameHeight: config.enemyHeight,
      cols: 8,
      animations: zombieAnimations,
    });
    await z.load('assets/zombie.png', { frameWidth: config.enemyWidth, frameHeight: config.enemyHeight, cols: 8, animations: zombieAnimations });
    if (!z.img) {
      z.setPlaceholder(config.enemyWidth, config.enemyHeight, '#f87171');
    }
    zombieAnimData = z;
  }

  // 敌人动画状态（每敌人在 spawn 时初始化）
  function initEnemyAnim(enemy) {
    enemy.animAction = 'idle';
    enemy.animFrameIndex = 0;
    enemy.animElapsed = 0;
    // 新小僵尸动画字段（仅非 Boss 使用）
    enemy.anim = 'idle';
    enemy.frame = 0;
    enemy.frameTimer = 0;
    enemy.frameCount = 6;
    enemy.frameWidth = 0;
    enemy.frameHeight = 0;
    enemy.attackAnim = 'attack1';
    enemy.lastStateForAnim = enemy.state;
    enemy.isDying = false;
    enemy.deathPlayed = false;
  }
  function updateEnemyAnim(enemy, dt) {
    if (enemy.isBoss) {
      const def = bossSheetDefs[enemy.anim] || bossSheetDefs.idle;
      if (!def) return;
      const { img: sheetImg } = getBossSheetImage(def, enemy);
      const fc = def.frames;

      enemy.frameCount = fc;
      if (sheetImg && sheetImg.naturalWidth > 0 && sheetImg.naturalHeight > 0) {
        enemy.frameWidth = Math.floor(sheetImg.naturalWidth / fc);
        enemy.frameHeight = sheetImg.naturalHeight;
      }

      enemy.frameTimer += dt * 1000;
      while (enemy.frameTimer >= def.frameMs) {
        enemy.frameTimer -= def.frameMs;
        enemy.frame += 1;
        if (enemy.frame >= fc) {
          if (def.loop) enemy.frame = 0;
          else {
            enemy.frame = fc - 1;
            if (enemy.anim === 'death1' || enemy.anim === 'death2') enemy.deathPlayed = true;
            break;
          }
        }
      }
      return;
    }
    if (isAxeEnemy(enemy)) {
      const def = axeSheetDefs[enemy.anim] || axeSheetDefs.idle;
      if (!def) return;
      const { img: sheetImg } = getAxeSheetImage(def, enemy);
      const fc = getAxeFrameCount(def, sheetImg);
      enemy.frameCount = fc;
      if (sheetImg && sheetImg.naturalWidth > 0 && sheetImg.naturalHeight > 0) {
        enemy.frameWidth = Math.floor(sheetImg.naturalWidth / fc);
        enemy.frameHeight = sheetImg.naturalHeight;
      }
      enemy.frameTimer += dt * 1000;
      while (enemy.frameTimer >= def.frameMs) {
        enemy.frameTimer -= def.frameMs;
        enemy.frame += 1;
        if (enemy.frame >= fc) {
          if (def.loop) enemy.frame = 0;
          else {
            enemy.frame = fc - 1;
            if (enemy.anim === 'death') enemy.deathPlayed = true;
            else if (enemy.anim === 'attack1' || enemy.anim === 'attack2' || enemy.anim === 'hurt') enemy.anim = 'idle';
            break;
          }
        }
      }
      return;
    }
    if (isSecEnemy(enemy)) {
      const def = secSpriteAnimations[enemy.anim] || secSpriteAnimations.idle;
      if (!def) return;
      enemy.frameCount = def.frameCount;
      enemy.frameWidth = secSpriteMeta.frameWidth;
      enemy.frameHeight = secSpriteMeta.frameHeight;
      enemy.frameTimer += dt * 1000;
      const frameMs = 1000 / Math.max(1, def.fps);
      while (enemy.frameTimer >= frameMs) {
        enemy.frameTimer -= frameMs;
        enemy.frame += 1;
        if (enemy.frame >= def.frameCount) {
          if (def.loop) enemy.frame = 0;
          else {
            enemy.frame = def.frameCount - 1;
            if (enemy.anim === 'death') enemy.deathPlayed = true;
            else if (enemy.anim === 'attack1' || enemy.anim === 'attack2' || enemy.anim === 'hurt') enemy.anim = 'idle';
            break;
          }
        }
      }
      return;
    }

    if (!isMiniZombie(enemy)) {
      const def = zombieAnimations[enemy.animAction];
      if (!def || !zombieAnimData) return;
      if (!def.loop && enemy.animFrameIndex >= def.frameCount - 1) return;
      enemy.animElapsed += dt;
      const frameTime = 1 / def.fps;
      while (enemy.animElapsed >= frameTime) {
        enemy.animElapsed -= frameTime;
        enemy.animFrameIndex += 1;
        if (enemy.animFrameIndex >= def.frameCount) {
          if (def.loop) enemy.animFrameIndex = 0;
          else {
            enemy.animFrameIndex = def.frameCount - 1;
            if (enemy.animAction === 'attack' || enemy.animAction === 'hurt') enemy.animAction = 'idle';
          }
          break;
        }
      }
      return;
    }

    const def = enemySheetDefs[enemy.anim] || enemySheetDefs.idle;
    if (!def) return;
    enemy.frameCount = def.frames;
    if (def.img && def.img.naturalWidth > 0 && def.img.naturalHeight > 0) {
      enemy.frameWidth = Math.floor(def.img.naturalWidth / def.frames);
      enemy.frameHeight = def.img.naturalHeight;
    }
    enemy.frameTimer += dt * 1000;
    while (enemy.frameTimer >= def.frameMs) {
      enemy.frameTimer -= def.frameMs;
      enemy.frame += 1;
      if (enemy.frame >= def.frames) {
        if (def.loop) enemy.frame = 0;
        else {
          enemy.frame = def.frames - 1;
          if (enemy.anim === 'death') enemy.deathPlayed = true;
          else if (enemy.anim === 'attack1' || enemy.anim === 'attack2' || enemy.anim === 'hurt') enemy.anim = 'idle';
          break;
        }
      }
    }
  }
  function playEnemyAnim(enemy, action) {
    if (enemy.isBoss) {
      if (enemy.anim === action) return;
      enemy.anim = action;
      enemy.animAction = action; // 兼容 syncEnemyAnimAction 里对 animAction 的比较
      enemy.frame = 0;
      enemy.frameTimer = 0;
      enemy.deathPlayed = false;
      return;
    }
    if (isAxeEnemy(enemy)) {
      if (enemy.anim === action) return;
      enemy.anim = action;
      enemy.frame = 0;
      enemy.frameTimer = 0;
      return;
    }
    if (isSecEnemy(enemy)) {
      if (enemy.anim === action) return;
      enemy.anim = action;
      enemy.frame = 0;
      enemy.frameTimer = 0;
      return;
    }

    if (!isMiniZombie(enemy)) {
      if (enemy.animAction === action) return;
      enemy.animAction = action;
      enemy.animFrameIndex = 0;
      enemy.animElapsed = 0;
      return;
    }
    if (enemy.anim === action) return;
    enemy.anim = action;
    enemy.frame = 0;
    enemy.frameTimer = 0;
  }
  function drawEnemySprite(enemy, ctx, ex, ey) {
    if (enemy.isBoss) {
      const def = bossSheetDefs[enemy.anim] || bossSheetDefs.idle;
      const { img, mirror } = getBossSheetImage(def, enemy);
      const fc = def.frames;
      if (!img || !img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ex, ey, enemy.width, enemy.height);
        return;
      }
      const sw = Math.floor(img.naturalWidth / fc);
      const sh = img.naturalHeight;
      const sx = Math.min(fc - 1, enemy.frame) * sw;
      const dw = enemy.width;
      const dh = enemy.height;
      ctx.save();
      ctx.translate(ex, ey);
      if (mirror) {
        ctx.translate(dw, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, sx, 0, sw, sh, 0, 0, dw, dh);
      ctx.restore();
      return;
    }
    if (isAxeEnemy(enemy)) {
      const def = axeSheetDefs[enemy.anim] || axeSheetDefs.idle;
      const { img, mirror } = getAxeSheetImage(def, enemy);
      const fc = getAxeFrameCount(def, img);
      if (!img || !img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        ctx.fillStyle = '#dc2626'; // Zombie_Axe 资源加载失败：红色兜底
        ctx.fillRect(ex, ey, enemy.width, enemy.height);
        return;
      }
      const sw = Math.floor(img.naturalWidth / fc);
      const sh = img.naturalHeight;
      const sx = Math.min(fc - 1, enemy.frame) * sw;
      const dw = enemy.width;
      const dh = enemy.height;
      ctx.save();
      ctx.translate(ex, ey);
      if (mirror) {
        ctx.translate(dw, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, sx, 0, sw, sh, 0, 0, dw, dh);
      ctx.restore();
      return;
    }
    if (isSecEnemy(enemy)) {
      const def = secSpriteAnimations[enemy.anim] || secSpriteAnimations.idle;
      const img = secSpriteSheet;
      if (!img || !img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(ex, ey, enemy.width, enemy.height);
        return;
      }
      const sw = secSpriteMeta.frameWidth;
      const sh = secSpriteMeta.frameHeight;
      const idx = def.startFrame + Math.min(def.frameCount - 1, enemy.frame);
      const col = idx % secSpriteMeta.cols;
      const row = Math.floor(idx / secSpriteMeta.cols);
      const sx = col * sw;
      const sy = row * sh;
      const dw = enemy.width;
      const dh = enemy.height;
      ctx.save();
      ctx.translate(ex, ey);
      if (enemy.facing === -1) {
        ctx.translate(dw, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
      ctx.restore();
      return;
    }

    if (!isMiniZombie(enemy)) {
      if (!zombieAnimData || !zombieAnimData.img) return;
      const def = zombieAnimations[enemy.animAction] || zombieAnimations.idle;
      const idx = def.startFrame + enemy.animFrameIndex;
      const col = idx % zombieAnimData.cols;
      const row = Math.floor(idx / zombieAnimData.cols);
      const sw = zombieAnimData.frameWidth;
      const sh = zombieAnimData.frameHeight;
      const scaleW = enemy.isBoss ? config.bossWidth / config.enemyWidth : 1;
      const scaleH = enemy.isBoss ? config.bossHeight / config.enemyHeight : 1;
      const dw = sw * scaleW;
      const dh = sh * scaleH;
      ctx.save();
      ctx.translate(ex, ey);
      if (enemy.facing === -1) {
        ctx.translate(dw, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(zombieAnimData.img, col * sw, row * sh, sw, sh, 0, 0, dw, dh);
      ctx.restore();
      return;
    }

    const def = enemySheetDefs[enemy.anim] || enemySheetDefs.idle;
    const img = def?.img;
    if (!img || !img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ex, ey, enemy.width, enemy.height);
      return;
    }
    const sw = Math.floor(img.naturalWidth / def.frames);
    const sh = img.naturalHeight;
    const sx = Math.min(def.frames - 1, enemy.frame) * sw;
    const dw = enemy.width;
    const dh = enemy.height;
    ctx.save();
    ctx.translate(ex, ey);
    if (enemy.facing === -1) {
      ctx.translate(dw, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(img, sx, 0, sw, sh, 0, 0, dw, dh);
    ctx.restore();
  }

  // ========== DOM & Canvas ==========
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const playerHpBar = document.getElementById('player-hp-bar');
  const enemyHpBar = document.getElementById('enemy-hp-bar');
  const settlementOverlay = document.getElementById('settlement-overlay');
  const statTimeEl = document.getElementById('stat-time');
  const statHitsEl = document.getElementById('stat-hits');
  const statComboEl = document.getElementById('stat-combo');
  const gradeEl = document.getElementById('settlement-grade');
  const buffEl = document.getElementById('settlement-buff');
  const settlementTitleEl = document.getElementById('settlement-title');
  const postLevel2Row = document.getElementById('post-level2-row');
  const btnRestartRun = document.getElementById('btn-restart-run');
  const btnNextLevel = document.getElementById('btn-next-level');
  const touchRailP1 = document.getElementById('touch-rail-p1');
  const touchRailP2 = document.getElementById('touch-rail-p2');
  const useExternalTouchHud = !!touchRailP1;

  function setPostLevel2RowVisible(vis) {
    if (postLevel2Row) postLevel2Row.classList.toggle('hidden', !vis);
    const rb = document.getElementById('settlement-retry');
    if (rb) rb.classList.toggle('hidden', !!vis);
  }

  canvas.width = config.width;
  canvas.height = config.height;

  /** 每完整通关第三关（任意终局结算）+1，敌人血量/伤害/移速随周目上升（持久化） */
  const ENEMY_CLEAR_RANK_KEY = 'zombieBoxing_enemyClearRank';
  function loadEnemyClearRank() {
    try {
      const n = parseInt(localStorage.getItem(ENEMY_CLEAR_RANK_KEY) || '0', 10);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(n, 80);
    } catch (_) {
      return 0;
    }
  }
  function saveEnemyClearRank(n) {
    try {
      localStorage.setItem(ENEMY_CLEAR_RANK_KEY, String(n));
    } catch (_) {}
  }
  let enemyClearRank = loadEnemyClearRank();
  /** 无尽：每通一轮 +1 stack；相对上一轮约 +12.5%（1.125^stack），不再翻倍 */
  let endlessCombatStack = 0;
  /** 每通一轮相对上一轮的血/伤/速增幅（约 12.5%） */
  const ENDLESS_CYCLE_STAT_MUL = 1.125;
  function bumpEnemyClearRankAfterFinale() {
    enemyClearRank = Math.min(80, enemyClearRank + 1);
    saveEnemyClearRank(enemyClearRank);
  }
  /** 周目倍率：rank 线性成长（系数为旧版一半）；无尽 stack 为 1.125^stack */
  function getEnemyDifficultyMultipliers() {
    const r = Math.min(30, Math.max(0, enemyClearRank));
    const baseHp = Math.min(3.6, 1 + r * 0.085);
    const baseDmg = Math.min(3.3, 1 + r * 0.075);
    const baseSpd = Math.min(1.38, 1 + r * 0.0275);
    const stack = Math.min(24, Math.max(0, endlessCombatStack));
    const cycleMul = Math.pow(ENDLESS_CYCLE_STAT_MUL, stack);
    const cycleSpdMul = Math.pow(1.0625, stack);
    return {
      hp: baseHp * cycleMul,
      dmg: baseDmg * cycleMul,
      spd: Math.min(1.65, baseSpd * cycleSpdMul),
    };
  }

  const LOCALE_STORAGE_KEY = 'zombieBoxing_locale';
  const FRIENDLY_FIRE_STORAGE_KEY = 'zombieBoxing_coopFriendlyFire';
  let gameLocale = 'zh';
  let coopFriendlyFireEnabled = false;

  function loadGameSettings() {
    try {
      const loc = localStorage.getItem(LOCALE_STORAGE_KEY);
      gameLocale = loc === 'en' ? 'en' : 'zh';
      coopFriendlyFireEnabled = localStorage.getItem(FRIENDLY_FIRE_STORAGE_KEY) === '1';
    } catch (_) {
      gameLocale = 'zh';
      coopFriendlyFireEnabled = false;
    }
  }
  loadGameSettings();

  function saveLocale() {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, gameLocale);
    } catch (_) {}
  }

  function saveFriendlyFireSetting() {
    try {
      localStorage.setItem(FRIENDLY_FIRE_STORAGE_KEY, coopFriendlyFireEnabled ? '1' : '0');
    } catch (_) {}
  }

  function setGameLocale(next) {
    gameLocale = next === 'en' ? 'en' : 'zh';
    saveLocale();
    syncDomStaticLabels();
  }

  function toggleGameLocale() {
    setGameLocale(gameLocale === 'zh' ? 'en' : 'zh');
  }

  /** @type {Record<string, string | ((...a: unknown[]) => string)>} */
  const I18N_ZH = {
    menu_single: '单人模式',
    menu_coop: '多人游戏',
    coop_sub_title: '双人模式',
    coop_sub_versus: 'Versus（两人对抗）',
    coop_sub_coop: 'Co-op（两人合作）',
    coop_sub_hint: 'W/S 选择 · J 确认 · Esc 返回',
    coop_sub_nav: 'Versus：五局 · 无怪物 · 无加成',
    versus_hud: (r, w1, w2) => `1v1  第 ${r}/5 局  ·  P1 ${w1} : ${w2} P2`,
    versus_round_draw: '双倒 — 本局重赛',
    versus_round_win_p1: '本局 P1 胜',
    versus_round_win_p2: '本局 P2 胜',
    versus_match_title: '五局结束',
    versus_match_win_p1: 'P1 获胜',
    versus_match_win_p2: 'P2 获胜',
    versus_match_tie: '平局',
    versus_press_continue: '按 Enter / J 返回主菜单',
    menu_controls: '按键说明',
    menu_options: '选项',
    title_main: '丧尸拳击',
    menu_rank: (n) => `敌方强度周目 ${n} · 通第三关终局 +1`,
    menu_nav_hint: 'W/S 或 ↑/↓ 选择，J 或 Enter 确认',
    menu_help_note: '（含「按键说明」）',
    opt_title: '选项',
    opt_language: '语言',
    opt_lang_zh: '中文',
    opt_lang_en: 'English',
    opt_friendly_fire: '友军伤害',
    opt_ff_hint: '双人模式下双方攻击可造成伤害',
    opt_on: '开',
    opt_off: '关',
    opt_back: '返回',
    opt_nav: 'W/S 选择 · J 切换或确认 · Esc 返回',
    opt_hint_lang: '（选中后按 J 切换语言）',
    opt_hint_ff: '（选中后按 J 开关友军伤害）',
    pause_title: '暂停',
    pause_resume: '按 ESC 继续游戏',
    controls_title: '按键说明',
    controls_p1: 'P1',
    controls_p2: 'P2',
    controls_ops: '操作',
    controls_close_menu: '按任意键关闭',
    controls_close_game: '按 Enter 或 空格 关闭并开始',
    hud_dodge: '闪',
    hud_attack: '攻击',
    hud_block: '格挡',
    hud_super: '超级拳',
    hud_shift_l: '左 Shift',
    hud_shift_r: '右 Shift',
    god_tap_g: 'G 键 · 点击',
    god_tap_c: 'C 键 · 点击',
    god_locked: '未解锁神阶',
    god_fly: (s) => `飞行 ${s}s`,
    god_ronin: '狂暴模式',
    god_gunner: '狂暴模式',
    god_martial: '狂暴模式',
    settle_gunner_title: '恭喜成为冥焰枪客',
    settle_gunner_grade: '红黑为誓 · 弹无虚发',
    settle_gunner_buff: '移动鼠标调整发射线，点击射击；四发倒身体、爆头一击。狂暴时仅能射击。',
    settle_gunner_buff_coop: ' 双人：P1、P2 均已就位。',
    settle_martial_title: '恭喜成为武林高手',
    settle_martial_grade: '降龙入掌 · 武道宗师',
    settle_martial_buff: 'G 键开启/取消狂暴；狂暴时按 J 出拳，会额外打出降龙十八掌。',
    settle_martial_buff_coop: ' 双人：P1、P2 均已领悟降龙十八掌。',
    god_thor: '雷神闪电移动',
    god_demon: '魔神·飞行',
    god_angel: '天使降临',
    god_berserk: '狂暴模式',
    god_generic: '神技',
    stat_time: '通关时间',
    stat_hits: '受击次数',
    stat_combo: '分数',
    stat_score_hint: '（每存活 1 秒 = 3 分）',
    endless_cycle: '难度提升 · 下一循环',
    btn_retry: 'RETRY',
    btn_next_stage: '进入第二关',
    btn_restart_run: '重新开始',
    btn_next_level: '进入下一关',
    btn_wave_again: '再来一波',
    doc_title: '横版格斗 Demo',
    settle_l1_title: '第一关 · 结算',
    settle_l1_buff: '是否进入第二关？',
    settle_l1_buff_coop: '是否进入第二关？（双人：进度与资格对 P1、P2 同时生效）',
    settle_l2_title: '第二关 · 完成',
    settle_l2_buff: '请选择：重新开始 或 进入下一关',
    settle_l2_buff_coop: '请选择：重新开始 或 进入下一关（双人：开局增益与神阶对两人一致）',
    settle_thor_title: '恭喜获得雷神神格',
    settle_thor_grade: '已晋升为雷神',
    settle_thor_buff: '魔神之躯承引天雷，位格再升一层，故诸力倍增。',
    settle_thor_buff_coop: ' 双人：P1、P2 均已晋升。',
    settle_ronin_title: '恭喜成为流浪剑客',
    settle_ronin_grade: '剑心通明 · 位在雷神之上',
    settle_ronin_buff: '头顶棕环为志，足下赤尘为誓；狂暴之时，出拳即银虹。',
    settle_ronin_buff_coop: ' 双人：P1、P2 均已就位。',
    settle_l3_title: '第三关 · 通关',
    settle_l3_grade: '流浪剑客',
    settle_l3_buff: '诸位阶已满，江湖再战。',
    settle_l3_buff_coop: ' 双人：加成已对 P1、P2 同步。',
    settle_demon_title: '恭喜获得魔鬼药水',
    settle_demon_grade: '已晋升为魔神',
    settle_demon_buff_coop: '双人：P1、P2 均已获得魔鬼药水与魔神位格。',
    settle_angel_title: '恭喜获得天使药水',
    settle_angel_grade: '已升华 · 天使其临',
    settle_angel_buff_coop: '双人：P1、P2 均已获得天使药水与位格加成。',
    settle_berserk_title: '恭喜获得狂战士药水',
    settle_berserk_grade: '已升级成为狂战士',
    settle_berserk_buff: '血脉沸腾，诸力初显。',
    settle_berserk_buff_coop: '双人：P1、P2 均已获得狂战士祝福；伤害与生命上限等已对两人同步。',
    settle_defeat_title: '战败',
    settle_result: 'RESULT',
  };

  const I18N_EN = {
    menu_single: 'Single Player',
    menu_coop: 'Multiplayer',
    coop_sub_title: 'Two players',
    coop_sub_versus: 'Versus (PvP)',
    coop_sub_coop: 'Co-op (PvE)',
    coop_sub_hint: 'W/S: select · J: confirm · Esc: back',
    coop_sub_nav: 'Versus: 5 rounds · no enemies · no buffs',
    versus_hud: (r, w1, w2) => `1v1  Round ${r}/5  ·  P1 ${w1} : ${w2} P2`,
    versus_round_draw: 'Double KO — replay round',
    versus_round_win_p1: 'Round to P1',
    versus_round_win_p2: 'Round to P2',
    versus_match_title: 'Match over',
    versus_match_win_p1: 'P1 wins',
    versus_match_win_p2: 'P2 wins',
    versus_match_tie: 'Draw',
    versus_press_continue: 'Enter / J — main menu',
    menu_controls: 'Controls',
    menu_options: 'Options',
    title_main: 'Zombie Boxing',
    menu_rank: (n) => `Enemy scaling cycle ${n} · +1 per Act III finale clear`,
    menu_nav_hint: 'W/S or ↑/↓ to select · J or Enter to confirm',
    menu_help_note: '(includes Controls)',
    opt_title: 'Options',
    opt_language: 'Language',
    opt_lang_zh: '中文',
    opt_lang_en: 'English',
    opt_friendly_fire: 'Friendly fire',
    opt_ff_hint: 'In co-op, players can hurt each other with attacks',
    opt_on: 'On',
    opt_off: 'Off',
    opt_back: 'Back',
    opt_nav: 'W/S: move · J: toggle/confirm · Esc: back',
    opt_hint_lang: '(Press J on this row to switch language)',
    opt_hint_ff: '(Press J on this row to toggle friendly fire)',
    pause_title: 'Paused',
    pause_resume: 'Press ESC to resume',
    controls_title: 'Controls',
    controls_p1: 'P1',
    controls_p2: 'P2',
    controls_ops: 'Controls',
    controls_close_menu: 'Press any key to close',
    controls_close_game: 'Press Enter or Space to close and start',
    hud_dodge: 'Dodge',
    hud_attack: 'Attack',
    hud_block: 'Block',
    hud_super: 'Super punch',
    hud_shift_l: 'L Shift',
    hud_shift_r: 'R Shift',
    god_tap_g: 'G · tap',
    god_tap_c: 'C · tap',
    god_locked: 'No god tier yet',
    god_fly: (s) => `Fly ${s}s`,
    god_ronin: 'Berserk mode',
    god_gunner: 'Berserk mode',
    god_martial: 'Berserk mode',
    settle_gunner_title: 'Crimson gunner ascended',
    settle_gunner_grade: 'Red-black vow · never miss',
    settle_gunner_buff: 'Move mouse to aim, click to fire; four body hits or one headshot. Rage: shoot only.',
    settle_gunner_buff_coop: ' Co-op: both ready.',
    settle_martial_title: 'Martial master ascended',
    settle_martial_grade: 'Dragon palm · grandmaster',
    settle_martial_buff: 'G toggles berserk. While berserk is active, press J to release Eighteen Dragon Palms.',
    settle_martial_buff_coop: ' Co-op: both players learn the dragon palm.',
    god_thor: 'Thor lightning dash',
    god_demon: 'Demon · flight',
    god_angel: 'Angel descent',
    god_berserk: 'Berserk mode',
    god_generic: 'God skill',
    stat_time: 'Clear time',
    stat_hits: 'Times hit',
    stat_combo: 'Score',
    stat_score_hint: '(3 points per second survived)',
    endless_cycle: 'Difficulty up · next loop',
    btn_retry: 'RETRY',
    btn_next_stage: 'Act II',
    btn_restart_run: 'Restart run',
    btn_next_level: 'Next stage',
    btn_wave_again: 'Fight again',
    doc_title: 'Zombie Boxing Demo',
    settle_l1_title: 'Act I · Results',
    settle_l1_buff: 'Continue to Act II?',
    settle_l1_buff_coop: 'Continue to Act II? (Co-op: both players share progress.)',
    settle_l2_title: 'Act II · Complete',
    settle_l2_buff: 'Choose: restart run or next stage.',
    settle_l2_buff_coop: 'Choose: restart run or next stage. (Co-op: buffs and tiers apply to both.)',
    settle_thor_title: 'Thor ascension',
    settle_thor_grade: 'Promoted: Thor',
    settle_thor_buff: 'The demon body channels thunder; power surges again.',
    settle_thor_buff_coop: ' Co-op: both promoted.',
    settle_ronin_title: 'Ronin ascension',
    settle_ronin_grade: 'Clear mind · above Thor',
    settle_ronin_buff: 'Brown halo marks your will; red dust your vow; in rage, every punch draws silver light.',
    settle_ronin_buff_coop: ' Co-op: both ready.',
    settle_l3_title: 'Act III · Cleared',
    settle_l3_grade: 'Ronin',
    settle_l3_buff: 'All tiers maxed. Fight again anytime.',
    settle_l3_buff_coop: ' Co-op: both receive the bonus.',
    settle_demon_title: 'Demon elixir',
    settle_demon_grade: 'Promoted: Demon',
    settle_demon_buff_coop: 'Co-op: both gain demon elixir and rank.',
    settle_angel_title: 'Angel elixir',
    settle_angel_grade: 'Ascended · angel\'s grace',
    settle_angel_buff_coop: 'Co-op: both gain angel elixir and bonuses.',
    settle_berserk_title: 'Berserker elixir',
    settle_berserk_grade: 'Upgraded: Berserker',
    settle_berserk_buff: 'Blood boils; power awakens.',
    settle_berserk_buff_coop: 'Co-op: both gain the berserker blessing; damage and max HP stay in sync.',
    settle_defeat_title: 'Defeat',
    settle_result: 'RESULT',
  };

  function tr(id, ...args) {
    const table = gameLocale === 'en' ? I18N_EN : I18N_ZH;
    let v = table[id];
    if (v === undefined) v = I18N_ZH[id];
    if (typeof v === 'function') return /** @type {(...a: unknown[]) => string} */ (v)(...args);
    return v !== undefined ? v : id;
  }

  function applyTouchHudI18n() {
    const setPair = (root, mainSel, subSel, main, sub) => {
      const el = typeof root === 'string' ? document.getElementById(root) : root;
      if (!el) return;
      const m = el.querySelector(mainSel);
      const s = el.querySelector(subSel);
      if (m) m.textContent = main;
      if (s) s.textContent = sub;
    };
    setPair('touch-dodge-p1', '.touch-btn-main', '.touch-btn-sub', tr('hud_dodge'), tr('hud_shift_l'));
    setPair('touch-j-p1', '.touch-btn-main', '.touch-btn-sub', 'J', tr('hud_attack'));
    setPair('touch-l-p1', '.touch-btn-main', '.touch-btn-sub', 'L', tr('hud_block'));
    setPair('touch-k-p1', '.touch-super-fallback', '.touch-btn-sub', 'K', tr('hud_super'));
    setPair('touch-dodge-p2', '.touch-btn-main', '.touch-btn-sub', tr('hud_dodge'), tr('hud_shift_r'));
    setPair('touch-b-p2', '.touch-btn-main', '.touch-btn-sub', 'B', tr('hud_attack'));
    setPair('touch-m-p2', '.touch-btn-main', '.touch-btn-sub', 'M', tr('hud_block'));
    setPair('touch-n-p2', '.touch-super-fallback', '.touch-btn-sub', 'N', tr('hud_super'));
  }

  function syncDomStaticLabels() {
    document.documentElement.lang = gameLocale === 'en' ? 'en' : 'zh-CN';
    document.title = tr('doc_title');
    const lt = document.getElementById('stat-lbl-time');
    const lh = document.getElementById('stat-lbl-hits');
    const lc = document.getElementById('stat-lbl-combo');
    if (lt) lt.textContent = tr('stat_time');
    if (lh) lh.textContent = tr('stat_hits');
    if (lc) lc.textContent = tr('stat_combo');
    if (btnRestartRun) btnRestartRun.textContent = tr('btn_restart_run');
    if (btnNextLevel) btnNextLevel.textContent = tr('btn_next_level');
    applyTouchHudI18n();
  }
  syncDomStaticLabels();

  // ========== 关卡统计 ==========
  const stats = {
    gameStartTime: 0,
    hitCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    reset() {
      this.hitCount = 0;
      this.currentCombo = 0;
      this.maxCombo = 0;
    },
  };
  function recordPlayerHit() {
    stats.hitCount += 1;
    stats.currentCombo = 0;
    player.combo = 0; // 被打断：连击清零
  }
  function recordPlayerLandHit() {
    stats.currentCombo += 1;
    stats.maxCombo = Math.max(stats.maxCombo, stats.currentCombo);
  }

  // ========== 强化系统（通关后随机获得，永久生效） ==========
  const buffs = [
    { id: 'atk', name: '攻击力 +20%' },
    { id: 'knockback', name: '击退增强' },
    { id: 'lifesteal', name: '5% 吸血' },
    { id: 'atkSpeed', name: '攻击速度 +15%' },
  ];
  const playerBuffs = [];
  /** 第三关首次通关：血量×3、攻击×2、攻速×5、击退×1.5 */
  let berserkerMode = false;
  /** 第三关再次通关（已狂战士）：在狂战士基础上全属性再×2，金光环与金色拳光 */
  let angelMode = false;
  /** 魔神：在天使之上全属性再×2；与魔鬼药水同源（按 M / Q 为满阶雷神） */
  let demonMode = false;
  /** 第四次通关：魔神之上再×2，雷光外观 */
  let thorMode = false;
  /** 第五次通关（已雷神）：流浪剑客；棕色光环、狂暴时每次 J 出手即银色剑气、普攻伤害为雷神面板×3 */
  let roninMode = false;
  /** 第六次通关（已流浪剑客）：冥焰枪客；红黑光环、按住鼠标/触控连射，四发倒任意怪 */
  let gunnerMode = false;
  /** 第七次通关（已冥焰枪客）：武林高手；G 开关狂暴，狂暴时 J 追加降龙十八掌 */
  let martialMode = false;
  /** 第二关结束选「重新开始」时随机一项：'hp'|'atk'|'atkspd'|'knock' */
  let starterRunBuff = null;
  let postL2ChoiceActive = false;
  let berserkerFinaleActive = false;
  let angelFinaleActive = false;
  let demonFinaleActive = false;
  let thorFinaleActive = false;
  let roninFinaleActive = false;
  let gunnerFinaleActive = false;
  let martialFinaleActive = false;
  /** 第三关通关但已满阶（流浪剑客），仅统计与再来一波 */
  let level3MaxTierClearActive = false;
  /** P1 按 F 紧急回血：每局 4 次，每次回满当前 maxHp */
  let healChargesRemaining = 4;
  /** P2 按 V 紧急回血：每局 4 次，每次回满当前 maxHp（仅双人模式） */
  let healChargesRemainingP2 = 4;

  /** 神阶专属技能（G 键 / 左下按钮） */
  const DEMON_FLIGHT_DURATION_SEC = 15;
  /** 小天使普攻相对原系数的倍率（原 0.22 × 本值） */
  const ANGEL_MINION_DAMAGE_MUL = 3;
  /** 天使随从金色飞弹（打敌人，不打玩家） */
  const angelMinionBolts = [];
  /** 雷神闪电拖尾（线段 + 电弧） */
  const thorSkillTrailParticles = [];
  /** 流浪剑客：脚下红色粒子拖尾 */
  const roninFootTrailParticles = [];
  /** 流浪剑客：狂暴下每次 J 出手一道银色剑气；穿透多敌，仅飞出地图边界才消失 */
  const roninSwordQi = [];
  /** 武林高手：降龙十八掌龙影与掌风 */
  const xianglongDragonPalms = [];
  const xianglongPalmWaves = [];
  const xianglongSparks = [];
  const XIANGLONG_DRAGON_SPEED = 560;
  const XIANGLONG_DRAGON_DAMAGE_MUL = 12;
  /** 冥焰枪客：瞄准用（pointermove 更新角度，pointerdown 点射） */
  const GUNNER_BULLET_HITS_TO_KILL = 4;
  const GUNNER_SHOOT_INTERVAL = 0.2;
  const GUNNER_BULLET_SPEED = 2100;
  const GUNNER_BULLET_HIT_SHAKE_MS = 42;
  const GUNNER_BULLET_HIT_SHAKE_AMP = 1.6;
  const GUNNER_HEADSHOT_MP3_URL = 'bhit_helmet-1.mp3';
  const GUNNER_SHOOT_MP3_URL = 'usp1_8699f.mp3';
  const GUNNER_HEADSHOT_VOLUME = 0.21;
  const GUNNER_SHOOT_VOLUME = 0.33;
  /** 沙鹰 mp3 开头可能有较长静音，扫描窗口加大 */
  const GUNNER_SHOOT_ATTACK_SCAN_SEC = 1.4;

  /** 跳过 MP3 文件开头的静音，减少「点了才响」的体感延迟 */
  function sfxFindAttackOffset(audioBuffer, scanSec = 0.18, threshold = 0.025) {
    const ch = audioBuffer.getChannelData(0);
    const maxI = Math.min(ch.length, Math.floor(scanSec * audioBuffer.sampleRate));
    for (let i = 0; i < maxI; i++) {
      if (Math.abs(ch[i]) > threshold) return i / audioBuffer.sampleRate;
    }
    return 0;
  }

  /** 开枪：游戏加载时 fetch+decode 一次，开枪只播缓存 buffer */
  const GunnerShootSfx = {
    buffer: null,
    gain: null,
    startOffset: 0,
    loadPromise: null,
    ensureGain(ctx) {
      if (!this.gain) {
        this.gain = ctx.createGain();
        this.gain.gain.value = GUNNER_SHOOT_VOLUME;
        this.gain.connect(ctx.destination);
      }
    },
    ensureLoad() {
      if (this.loadPromise) return this.loadPromise;
      this.loadPromise = (async () => {
        try {
          const ctx = ensureAudio();
          const res = await fetch(GUNNER_SHOOT_MP3_URL);
          if (!res.ok) return;
          const raw = await res.arrayBuffer();
          this.buffer = await ctx.decodeAudioData(raw);
          this.startOffset = sfxFindAttackOffset(
            this.buffer,
            GUNNER_SHOOT_ATTACK_SCAN_SEC,
            0.02
          );
          this.ensureGain(ctx);
        } catch (_) { /* ignore */ }
      })();
      return this.loadPromise;
    },
    play() {
      try {
        const ctx = ensureAudio();
        if (ctx.state === 'suspended') void ctx.resume();
        if (!this.buffer) {
          void this.ensureLoad();
          return;
        }
        this.ensureGain(ctx);
        const src = ctx.createBufferSource();
        src.buffer = this.buffer;
        src.connect(this.gain);
        src.start(0, this.startOffset);
      } catch (_) { /* ignore */ }
    },
  };

  function playShot() {
    GunnerShootSfx.play();
  }

  /** 枪客曳光弹：火星拖尾 + 发光弹头（Canvas 2D / lighter 混合） */
  const TRACER_SPARK_PALETTE = ['#fffdf0', '#ffe27a', '#ffb028', '#ff7a1a', '#8a2010'];

  class TracerTrailSpark {
    constructor(x, y, ux, uy, spread) {
      this.x = x;
      this.y = y;
      this.px = x;
      this.py = y;
      const spd = 0.5 + Math.random() * 1.5;
      const px = -uy;
      const py = ux;
      const jitter = (Math.random() - 0.5) * spread;
      this.vx = -ux * spd + px * jitter * 0.22;
      this.vy = -uy * spd + py * jitter * 0.22;
      this.life = 1;
      this.decay = 0.08 + Math.random() * 0.08;
      this.size = 0.6 + Math.random() * 1.4;
      this.color = TRACER_SPARK_PALETTE[(Math.random() * TRACER_SPARK_PALETTE.length) | 0];
    }
    update(dt) {
      const f = dt * 60;
      this.px = this.x;
      this.py = this.y;
      this.vy *= Math.pow(0.9, f);
      this.vx *= Math.pow(0.92, f);
      this.x += this.vx * f;
      this.y += this.vy * f;
      this.life -= this.decay * f;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size * this.life;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
  }

  class GunnerBulletTrail {
    constructor(vx, vy, opt = {}) {
      const len = Math.hypot(vx, vy) || 1;
      this.ux = vx / len;
      this.uy = vy / len;
      this.trail = opt.trail ?? 10;
      this.density = opt.density ?? 5;
      this.spread = opt.spread ?? 3.5;
      this.sparks = [];
      this.stopEmit = false;
    }
    emit(x, y, movedDist) {
      if (this.stopEmit || movedDist <= 0) return;
      for (let i = 0; i < this.density; i++) {
        const back = -Math.random() * movedDist;
        const sx = x + this.ux * back;
        const sy = y + this.uy * back;
        const s = new TracerTrailSpark(sx, sy, this.ux, this.uy, this.spread);
        s.decay *= 12 / Math.max(this.trail, 1);
        this.sparks.push(s);
      }
    }
    update(dt) {
      for (const s of this.sparks) s.update(dt);
      this.sparks = this.sparks.filter((s) => s.life > 0);
    }
    draw(ctx) {
      if (!this.sparks.length) return;
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'lighter';
      for (const s of this.sparks) s.draw(ctx);
      ctx.globalCompositeOperation = prev;
      ctx.globalAlpha = 1;
    }
    get empty() {
      return this.sparks.length === 0;
    }
  }

  function createGunnerBulletTrail(vx, vy) {
    return new GunnerBulletTrail(vx, vy, { trail: 10, density: 6, spread: 4 });
  }

  function orphanGunnerBulletTrail(trail) {
    if (!trail) return;
    trail.stopEmit = true;
    if (!trail.empty) gunnerBulletTrailRemnants.push(trail);
  }

  function clearXianglongEffects() {
    xianglongDragonPalms.length = 0;
    xianglongPalmWaves.length = 0;
    xianglongSparks.length = 0;
  }

  function drawGunnerBulletTracerHead(ctx, b) {
    const vx = b.vx || 0;
    const vy = b.vy || 0;
    const len = Math.hypot(vx, vy) || 1;
    const ux = vx / len;
    const uy = vy / len;
    const x = b.x;
    const y = b.y;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const streakLen = 16;
    const g = ctx.createLinearGradient(
      x - ux * streakLen,
      y - uy * streakLen,
      x + ux * 5,
      y + uy * 5
    );
    g.addColorStop(0, 'rgba(138, 32, 16, 0)');
    g.addColorStop(0.25, 'rgba(255, 122, 26, 0.45)');
    g.addColorStop(0.55, 'rgba(255, 176, 40, 0.75)');
    g.addColorStop(0.82, 'rgba(255, 226, 122, 0.92)');
    g.addColorStop(1, 'rgba(255, 255, 250, 1)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - ux * streakLen, y - uy * streakLen);
    ctx.lineTo(x + ux * 2.5, y + uy * 2.5);
    ctx.stroke();
    const rg = ctx.createRadialGradient(x, y, 0, x, y, 9);
    rg.addColorStop(0, 'rgba(255, 255, 255, 1)');
    rg.addColorStop(0.28, 'rgba(255, 226, 122, 0.92)');
    rg.addColorStop(0.58, 'rgba(255, 176, 40, 0.5)');
    rg.addColorStop(0.82, 'rgba(255, 122, 26, 0.22)');
    rg.addColorStop(1, 'rgba(138, 32, 16, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function updateGunnerBulletTrailRemnants(dt) {
    for (let i = gunnerBulletTrailRemnants.length - 1; i >= 0; i--) {
      gunnerBulletTrailRemnants[i].update(dt);
      if (gunnerBulletTrailRemnants[i].empty) gunnerBulletTrailRemnants.splice(i, 1);
    }
  }

  function drawGunnerBulletTracers(ctx) {
    if (!playerBullets.length && !gunnerBulletTrailRemnants.length) return;
    for (const b of playerBullets) {
      if (b.trail) b.trail.draw(ctx);
    }
    for (const tr of gunnerBulletTrailRemnants) tr.draw(ctx);
    for (const b of playerBullets) drawGunnerBulletTracerHead(ctx, b);
  }

  /** 爆头命中：一次性放射火星 + 中心闪光环（Canvas 2D / lighter） */
  const HEADSHOT_BURST_PALETTES = {
    gold: ['#fffdf0', '#ffe27a', '#ffb028', '#ff7a1a', '#8a2010'],
    orange: ['#fff2e0', '#ffb060', '#ff6a1f', '#d83a10'],
    white: ['#ffffff', '#dfe8ff', '#aebfff', '#7f93ff'],
  };

  class HeadshotBurstSpark {
    constructor(x, y, angle, speed, palette, gravity) {
      this.x = x;
      this.y = y;
      this.px = x;
      this.py = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = gravity;
      this.drag = 0.82 + Math.random() * 0.08;
      this.life = 1;
      this.decay = 0.038 + Math.random() * 0.055;
      this.size = 0.6 + Math.random() * 1.1;
      this.color = palette[(Math.random() * palette.length) | 0];
    }
    update(dt) {
      const f = dt * 60;
      this.px = this.x;
      this.py = this.y;
      this.vx *= Math.pow(this.drag, f);
      this.vy *= Math.pow(this.drag, f);
      if (this.gravity) this.vy += this.gravity * f;
      this.x += this.vx * f;
      this.y += this.vy * f;
      this.life -= this.decay * f;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      const seg = Math.min(1, this.life * 1.35);
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size * seg;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x - (this.x - this.px) * seg, this.y - (this.y - this.py) * seg);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
  }

  class HeadshotBurst {
    constructor(x, y, opt = {}) {
      const count = opt.count ?? 30;
      const speed = opt.speed ?? 5;
      const spread = ((opt.spread ?? 360) * Math.PI) / 180;
      const gravity = opt.gravity ?? 0;
      const palette = HEADSHOT_BURST_PALETTES[opt.style] || HEADSHOT_BURST_PALETTES.gold;
      const baseAng = opt.dir ?? -Math.PI / 2;
      this.sparks = [];
      for (let i = 0; i < count; i++) {
        const a = baseAng + (Math.random() - 0.5) * spread;
        const sp = speed * (0.55 + Math.random() * 0.55);
        const spark = new HeadshotBurstSpark(x, y, a, sp, palette, gravity);
        if (spark.vy > -0.35) spark.vy = -0.35 - Math.random() * 1.4;
        this.sparks.push(spark);
      }
      this.flash = { x, y, r: 2, life: 1, color: palette[0] };
    }
    update(dt) {
      const f = dt * 60;
      if (this.flash.life > 0) {
        this.flash.r += 2.2 * f;
        this.flash.life -= 0.14 * f;
      }
      for (const s of this.sparks) s.update(dt);
      this.sparks = this.sparks.filter((s) => s.life > 0);
    }
    draw(ctx) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'lighter';
      if (this.flash.life > 0) {
        ctx.globalAlpha = Math.max(0, this.flash.life) * 0.8;
        const g = ctx.createRadialGradient(
          this.flash.x,
          this.flash.y,
          0,
          this.flash.x,
          this.flash.y,
          this.flash.r + 8
        );
        g.addColorStop(0, this.flash.color);
        g.addColorStop(0.4, 'rgba(255,180,60,0.5)');
        g.addColorStop(1, 'rgba(255,120,20,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.flash.x, this.flash.y, this.flash.r + 8, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const s of this.sparks) s.draw(ctx);
      ctx.globalCompositeOperation = prev;
      ctx.globalAlpha = 1;
    }
    get done() {
      return this.flash.life <= 0 && this.sparks.length === 0;
    }
  }

  function spawnHeadshotBurst(x, y, bulletVx, bulletVy) {
    headshotBurstEffects.push(
      new HeadshotBurst(x, y, {
        dir: -Math.PI / 2,
        style: 'gold',
        count: 30,
        speed: 6,
        spread: 120,
        gravity: 0,
      })
    );
  }

  function updateHeadshotBursts(dt) {
    for (let i = headshotBurstEffects.length - 1; i >= 0; i--) {
      headshotBurstEffects[i].update(dt);
      if (headshotBurstEffects[i].done) headshotBurstEffects.splice(i, 1);
    }
  }

  function drawHeadshotBursts(ctx) {
    if (!headshotBurstEffects.length) return;
    for (const burst of headshotBurstEffects) burst.draw(ctx);
  }
  const GunnerHeadshotSfx = {
    buffer: null,
    gain: null,
    startOffset: 0,
    loadPromise: null,
    durationSec: 0.45,
    ensureLoad() {
      if (this.loadPromise) return this.loadPromise;
      this.loadPromise = (async () => {
        try {
          const ctx = ensureAudio();
          const res = await fetch(GUNNER_HEADSHOT_MP3_URL);
          if (!res.ok) return;
          const raw = await res.arrayBuffer();
          this.buffer = await ctx.decodeAudioData(raw);
          if (this.buffer.duration > 0) this.durationSec = this.buffer.duration;
          this.startOffset = sfxFindAttackOffset(this.buffer);
          if (!this.gain) {
            this.gain = ctx.createGain();
            this.gain.gain.value = GUNNER_HEADSHOT_VOLUME;
            this.gain.connect(ctx.destination);
          }
        } catch (_) { /* ignore */ }
      })();
      return this.loadPromise;
    },
    play() {
      try {
        const ctx = ensureAudio();
        if (ctx.state === 'suspended') void ctx.resume();
        if (this.buffer) {
          const source = ctx.createBufferSource();
          source.buffer = this.buffer;
          if (!this.gain) {
            this.gain = ctx.createGain();
            this.gain.gain.value = GUNNER_HEADSHOT_VOLUME;
            this.gain.connect(ctx.destination);
          }
          source.connect(this.gain);
          source.start(0, this.startOffset);
          return;
        }
      } catch (_) { /* ignore */ }
      void this.ensureLoad();
    },
  };
  /** G 键按住（用于神技按钮按下态；toggle 在首帧 !repeat 触发） */
  let godSkillKeyHeld = false;
  /** 双人 P2：C 键按住（外部神技条按下态） */
  let godSkillKeyHeldP2 = false;
  /** 触摸左下神技按钮未松手 */
  const godSkillPressingPointers = new Set();
  /** 外部神技条：区分 P1 / P2 指针（用于两侧独立高亮） */
  const godPointerIdsP1 = new Set();
  const godPointerIdsP2 = new Set();

  /** 画布内仅 P1 神技条按下态（与 P2 的 C 键无关） */
  function isGodSkillInputHeld() {
    return godSkillKeyHeld || godSkillPressingPointers.size > 0;
  }

  function getCurrentGodSkillTier() {
    if (martialMode) return 'martial';
    if (gunnerMode) return 'gunner';
    if (roninMode) return 'ronin';
    if (thorMode) return 'thor';
    if (demonMode) return 'demon';
    if (angelMode) return 'angel';
    if (berserkerMode) return 'berserker';
    return null;
  }

  function getGodSkillButtonLabel() {
    const tier = getCurrentGodSkillTier();
    if (tier === 'martial') return tr('god_martial');
    if (tier === 'gunner') return tr('god_gunner');
    if (tier === 'ronin') return tr('god_ronin');
    if (tier === 'thor') return tr('god_thor');
    if (tier === 'demon') return tr('god_demon');
    if (tier === 'angel') return tr('god_angel');
    if (tier === 'berserker') return tr('god_berserk');
    return tr('god_generic');
  }

  function applyBerserkerRageHp(on, target) {
    const p = target;
    if (!p || p.state !== 'alive') return;
    if (on) {
      p.maxHp = Math.max(1, Math.round(p.maxHp * 2));
      p.hp = Math.min(p.maxHp, Math.round(p.hp * 2));
    } else {
      const r = p.maxHp > 0 ? p.hp / p.maxHp : 1;
      p.maxHp = Math.max(1, Math.round(p.maxHp / 2));
      p.hp = Math.min(p.maxHp, Math.max(1, Math.round(p.maxHp * r)));
    }
  }

  function clearGodSkillsForTierChange() {
    for (const p of [player, player2]) {
      if (p.godRageActive) {
        applyBerserkerRageHp(false, p);
        p.godRageActive = false;
      }
      p.godThorMoveActive = false;
      p.godDemonFlyRemain = 0;
      p.godAngelSummonActive = false;
      p.godAngelMinions.length = 0;
    }
    angelMinionBolts.length = 0;
    thorSkillTrailParticles.length = 0;
    roninFootTrailParticles.length = 0;
    roninSwordQi.length = 0;
    playerBullets.length = 0;
    gunnerBulletTrailRemnants.length = 0;
    headshotBurstEffects.length = 0;
    gunFireEffects.length = 0;
    clearXianglongEffects();
  }

  function getGunnerMuzzlePos(actor) {
    return {
      x: actor.x + config.playerWidth / 2,
      y: actor.y + config.playerHeight * 0.38,
    };
  }

  function defaultGunnerAimAngle(actor) {
    return (actor.facing || 1) > 0 ? 0 : Math.PI;
  }

  function ensureGunnerAimAngle(actor) {
    if (typeof actor.gunnerAimAngle !== 'number') {
      actor.gunnerAimAngle = defaultGunnerAimAngle(actor);
    }
    return actor.gunnerAimAngle;
  }

  function setGunnerAimFromScreen(actor, gameX, gameY) {
    if (!actor || actor.state !== 'alive') return;
    const m = getGunnerMuzzlePos(actor);
    const dx = gameX - m.x;
    const dy = gameY - m.y;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    actor.gunnerAimAngle = Math.atan2(dy, dx);
  }

  function pickGunnerActorFromScreenX(gameX) {
    if (isCoopMode && gameX >= config.width / 2 && player2.state === 'alive') {
      return player2;
    }
    if (player.state === 'alive' && (!isCoopMode || gameX < config.width / 2)) {
      return player;
    }
    return null;
  }

  function isGunnerHudPointer(gameX, gameY) {
    if (useExternalTouchHud) return false;
    const R = getGameplayHudRects();
    return (
      hudRectHit(gameX, gameY, R.god) ||
      hudRectHit(gameX, gameY, R.dodge) ||
      hudRectHit(gameX, gameY, R.j) ||
      hudRectHit(gameX, gameY, R.l) ||
      hudRectHit(gameX, gameY, R.k)
    );
  }

  function prepGunnerCombatAudio() {
    if (!gunnerMode || martialMode) return;
    resumeGameAudio();
    void GunnerHeadshotSfx.ensureLoad();
    void GunnerShootSfx.ensureLoad();
  }

  function updateGunnerAimFromPointer(gameX, gameY) {
    if (!gunnerMode || martialMode || isVersusMode || gameState !== 'playing') return;
    if (isGunnerHudPointer(gameX, gameY)) return;
    const actor = pickGunnerActorFromScreenX(gameX);
    if (!actor) return;
    setGunnerAimFromScreen(actor, gameX, gameY);
  }

  function tryFireGunnerOnPointerDown(e, gameX, gameY, t) {
    if (!gunnerMode || martialMode || isVersusMode || gameState !== 'playing') return false;
    if (isGunnerHudPointer(gameX, gameY)) return false;
    const actor = pickGunnerActorFromScreenX(gameX);
    if (!actor) return false;
    if ((actor.gunnerShootCd || 0) > 0) return true;
    e.preventDefault();
    setGunnerAimFromScreen(actor, gameX, gameY);
    fireGunnerBullet(actor, t);
    actor.gunnerShootCd = GUNNER_SHOOT_INTERVAL;
    return true;
  }

  function getRoninGunnerMeleeMul() {
    if (martialMode) return 6;
    if (gunnerMode) return 6;
    if (roninMode) return 3;
    return 1;
  }

  function getGunnerBulletDamageForEnemy(enemy, zone = 'body') {
    const maxHp = enemy.maxHp || enemy.hp || 1;
    const bodyDmg = Math.max(1, Math.ceil(maxHp / GUNNER_BULLET_HITS_TO_KILL));
    if (zone === 'head') return bodyDmg * 4;
    return bodyDmg;
  }

  function fireGunnerBullet(actor, t) {
    if (!gunnerMode || martialMode || !actor || actor.state !== 'alive' || isVersusMode) return;
    playShot();
    const ang = ensureGunnerAimAngle(actor);
    const spd = GUNNER_BULLET_SPEED;
    const m = getGunnerMuzzlePos(actor);
    playerBullets.push({
      x: m.x + Math.cos(ang) * 8,
      y: m.y + Math.sin(ang) * 8,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      facing: Math.sign(Math.cos(ang)) || actor.facing || 1,
      life: 3.2,
      owner: actor,
      trail: createGunnerBulletTrail(Math.cos(ang) * spd, Math.sin(ang) * spd),
    });
    actor.gunnerShootOnlyAnim = true;
    actor.attackStart = t;
    actor.attackDurationSec = 0.11;
    if (actor === player && punchSprite) punchSprite.playOnce();
    else if (actor === player2 && punchSpriteP2) punchSpriteP2.playOnce();
  }

  function updateGunnerShooting(dt, t) {
    if (!gunnerMode || martialMode || isVersusMode || gameState !== 'playing') return;
    for (const actor of isCoopMode ? [player, player2] : [player]) {
      if (!actor || actor.state !== 'alive') continue;
      if (actor.gunnerShootCd > 0) {
        actor.gunnerShootCd -= dt;
        if (actor.gunnerShootCd < 0) actor.gunnerShootCd = 0;
      }
      clearGunnerShootAnim(actor, t);
    }
  }

  function clearGunnerShootAnim(actor, t) {
    if (!actor || !actor.gunnerShootOnlyAnim) return;
    const dur = actor.attackDurationSec || 0.11;
    if (actor.attackStart > 0 && t - actor.attackStart >= dur) {
      actor.gunnerShootOnlyAnim = false;
    }
  }

  /** 天使随从包围盒（略大于玩家，便于放大绘制精灵） */
  function getAngelMinionBodySize() {
    return {
      w: Math.max(30, Math.round(config.playerWidth * 1.06)),
      h: Math.max(58, Math.round(config.playerHeight * 1.06)),
    };
  }

  function spawnAngelMinionsPair(owner) {
    if (!owner) return;
    owner.godAngelMinions.length = 0;
    const { w, h } = getAngelMinionBodySize();
    const pw = config.playerWidth;
    const ph = config.playerHeight;
    for (const side of [-1, 1]) {
      owner.godAngelMinions.push({
        x: owner.x + pw / 2 + side * (pw * 0.6) - w / 2,
        y: owner.y + ph * 0.28 - h / 2,
        vx: 0,
        vy: 0,
        facing: side >= 0 ? 1 : -1,
        attackT: 0,
        rangedT: 0.1 + Math.random() * 0.35,
        w,
        h,
        side,
        owner,
      });
    }
  }

  function spawnAngelMinionBolt(m, target, t) {
    const cx = m.x + m.w / 2;
    const cy = m.y + m.h / 2;
    const tcx = target.x + target.width / 2;
    const tcy = target.y + target.height / 2;
    const dx = tcx - cx;
    const dy = tcy - cy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const spd = 440;
    const src = m.owner || player;
    const dmg = Math.max(
      5,
      Math.round(getPlayerDamage(src) * 0.19 * ANGEL_MINION_DAMAGE_MUL)
    );
    angelMinionBolts.push({
      x: cx,
      y: cy,
      vx: (dx / len) * spd,
      vy: (dy / len) * spd,
      life: 2.4,
      damage: dmg,
    });
  }

  function updateAngelMinionBolts(dt, t) {
    if (angelMinionBolts.length === 0) return;
    const br = 5;
    for (let i = angelMinionBolts.length - 1; i >= 0; i--) {
      const b = angelMinionBolts[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      let hit = false;
      for (const enemy of enemies) {
        if (enemy.hp <= 0) continue;
        const eBox = getEnemyHitbox(enemy);
        const bBox = {
          left: b.x - br,
          right: b.x + br,
          top: b.y - br,
          bottom: b.y + br,
        };
        if (!boxesOverlap(bBox, eBox)) continue;
        const hpBefore = enemy.hp;
        enemy.hp = Math.max(0, enemy.hp - b.damage);
        enemy.hurtEnd = t + 0.08;
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.06 });
        spawnBleedEffect(enemy);
        for (let k = 0; k < 4; k++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 140,
            vy: -70 - Math.random() * 80,
            life: 0.22,
            maxLife: 0.22,
            isRageGold: true,
          });
        }
        if ((berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) && hpBefore > 0 && enemy.hp <= 0) {
          spawnBerserkerKillGoldBeam(enemy);
        }
        if (hpBefore > 0 && enemy.hp <= 0) {
          const anyAlive = enemies.some((e) => e.hp > 0);
          if (anyAlive) addKillImpactScreenShake(enemy);
          else if (!slowMotionTimer) triggerSlowMotion(cx, cy, !!enemy.isBoss);
        }
        hit = true;
        break;
      }
      if (hit || b.life <= 0 || b.x < -80 || b.x > config.width + 80 || b.y < -120 || b.y > config.height + 80) {
        angelMinionBolts.splice(i, 1);
      }
    }
  }

  function toggleGodSkill(who) {
    if (!who || who.state !== 'alive') return;
    if (isVersusMode) return;
    const tier = getCurrentGodSkillTier();
    if (!tier) return;
    if (tier === 'martial' || tier === 'gunner' || tier === 'ronin') {
      if (who.godRageActive) {
        applyBerserkerRageHp(false, who);
        who.godRageActive = false;
      } else {
        who.godRageActive = true;
        applyBerserkerRageHp(true, who);
      }
      return;
    }
    if (tier === 'berserker') {
      if (who.godRageActive) {
        applyBerserkerRageHp(false, who);
        who.godRageActive = false;
      } else {
        who.godRageActive = true;
        applyBerserkerRageHp(true, who);
      }
      return;
    }
    if (tier === 'thor') {
      who.godThorMoveActive = !who.godThorMoveActive;
      if (!player.godThorMoveActive && !player2.godThorMoveActive) {
        thorSkillTrailParticles.length = 0;
      }
      return;
    }
    if (tier === 'demon') {
      if (who.godDemonFlyRemain <= 0) who.godDemonFlyRemain = DEMON_FLIGHT_DURATION_SEC;
      return;
    }
    if (tier === 'angel') {
      // 合作模式：天使随从应对两人同时生效（否则只有按 G 的 P1 有小天使，P2 永远没有）
      if (isCoopMode) {
        const turningOn = !who.godAngelSummonActive;
        for (const p of [player, player2]) {
          if (p.state !== 'alive') {
            p.godAngelSummonActive = false;
            p.godAngelMinions.length = 0;
            continue;
          }
          p.godAngelSummonActive = turningOn;
          if (turningOn) spawnAngelMinionsPair(p);
          else p.godAngelMinions.length = 0;
        }
      } else {
        who.godAngelSummonActive = !who.godAngelSummonActive;
        if (who.godAngelSummonActive) spawnAngelMinionsPair(who);
        else who.godAngelMinions.length = 0;
      }
    }
  }

  function applyAngelMinionMeleeHit(m, best, t) {
    const src = m.owner || player;
    const dmg = Math.max(
      6,
      Math.round(getPlayerDamage(src) * 0.22 * ANGEL_MINION_DAMAGE_MUL)
    );
    const hpBefore = best.hp;
    best.hp = Math.max(0, best.hp - dmg);
    best.hurtEnd = t + 0.08;
    const cx = best.x + best.width / 2;
    const cy = best.y + best.height / 2;
    hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.06 });
    spawnBleedEffect(best);
    for (let i = 0; i < 5; i++) {
      hitParticles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 160,
        vy: -80 - Math.random() * 90,
        life: 0.25,
        maxLife: 0.25,
        isRageGold: true,
      });
    }
    if ((berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) && hpBefore > 0 && best.hp <= 0) {
      spawnBerserkerKillGoldBeam(best);
    }
    if (hpBefore > 0 && best.hp <= 0) {
      const anyAlive = enemies.some((e) => e.hp > 0);
      if (anyAlive) addKillImpactScreenShake(best);
      else if (!slowMotionTimer) triggerSlowMotion(cx, cy, !!best.isBoss);
    }
  }

  function updateAngelMinionsForOwner(who, dt, t) {
    if (who.state !== 'alive') {
      who.godAngelSummonActive = false;
      who.godAngelMinions.length = 0;
      return;
    }
    if (!who.godAngelSummonActive || who.godAngelMinions.length === 0) return;
    const followAx = who.x + config.playerWidth / 2;
    const ph = config.playerHeight;
    const pw = config.playerWidth;
    const gy = config.groundY;

    for (const m of who.godAngelMinions) {
      const mh = m.h;
      const mw = m.w;
      const hoverPhase = t * 2.45 + m.side * 1.15;
      const hoverY =
        Math.sin(hoverPhase) * 14 + Math.sin(t * 1.65 + m.side * 2.5) * 6;
      const homeX = followAx + m.side * (pw * 0.55 + mw * 0.35) - mw / 2;
      const homeY = who.y + ph * 0.06 - mh * 0.4 + hoverY;

      let best = null;
      let bestD = 1e9;
      for (const e of enemies) {
        if (e.hp <= 0) continue;
        const dx = e.x + e.width / 2 - (m.x + mw / 2);
        const dy = e.y + e.height / 2 - (m.y + mh / 2);
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = e;
        }
      }

      const minFloatY = who.y - mh - 4;
      const maxFloatY = gy - mh - 16;

      if (best) {
        const tcx = best.x + best.width / 2;
        const tcy = best.y + best.height / 2;
        const mcx = m.x + mw / 2;
        const mcy = m.y + mh / 2;
        const dx = tcx - mcx;
        const dy = tcy - mcy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        m.facing = dx >= 0 ? 1 : -1;
        const reach = Math.max(48, mw * 0.9);
        const needRanged =
          dist > reach + 8 || Math.abs(dy) > 46 || Math.abs(dx) > pw * 1.85;

        if (needRanged) {
          m.x += (homeX - m.x) * Math.min(1, 3.6 * dt);
          m.y += (homeY - m.y) * Math.min(1, 3.6 * dt);
          m.vx *= 0.88;
          m.vy *= 0.88;
          m.rangedT = (m.rangedT ?? 0.35) - dt;
          if (m.rangedT <= 0) {
            m.rangedT = 0.48 + Math.random() * 0.12;
            spawnAngelMinionBolt(m, best, t);
          }
        } else {
          m.x += (homeX - m.x) * Math.min(1, 1.5 * dt);
          m.y += (homeY - m.y) * Math.min(1, 1.5 * dt);
          const chase = 255;
          if (dist > reach) {
            m.vx = (dx / dist) * chase;
            m.vy = (dy / dist) * chase * 0.48;
          } else {
            m.vx *= 0.84;
            m.vy *= 0.84;
          }
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.attackT -= dt;
          if (m.attackT <= 0 && dist < reach) {
            m.attackT = 0.42;
            applyAngelMinionMeleeHit(m, best, t);
          }
        }
      } else {
        m.x += (homeX - m.x) * Math.min(1, 3.8 * dt);
        m.y += (homeY - m.y) * Math.min(1, 3.8 * dt);
        m.vx *= 0.9;
        m.vy *= 0.9;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
      }

      m.y = Math.max(minFloatY, Math.min(m.y, maxFloatY));
      m.x = Math.max(0, Math.min(config.width - mw, m.x));
    }
  }

  function updateAngelMinions(dt, t) {
    updateAngelMinionsForOwner(player, dt, t);
    if (isCoopMode) updateAngelMinionsForOwner(player2, dt, t);
  }

  function emitThorTrailParticlesFor(pl) {
    if (!pl.godThorMoveActive || !thorMode || roninMode || pl.state !== 'alive') return;
    const spd = Math.abs(pl.vx);
    if (spd <= 14) return;
    const dir = pl.vx >= 0 ? 1 : -1;
    const bursts = spd > 220 ? 3 : spd > 130 ? 2 : 1;
    for (let b = 0; b < bursts; b++) {
      const x0 =
        pl.x +
        config.playerWidth * 0.5 -
        dir * (14 + Math.random() * 14) +
        (Math.random() - 0.5) * 8;
      const y0 =
        pl.y +
        config.playerHeight * (0.42 + Math.random() * 0.38) +
        (Math.random() - 0.5) * 10;
      const len = 26 + Math.min(62, spd * 0.16) + Math.random() * 26;
      const x1 = x0 - dir * len;
      const y1 = y0 + (Math.random() - 0.5) * 14;
      const ml = 0.32 + Math.random() * 0.22;
      thorSkillTrailParticles.push({
        x0,
        y0,
        x1,
        y1,
        vx: -dir * (28 + Math.random() * 36) + (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 32,
        life: ml,
        maxLife: ml,
        w: 1.4 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        wobble: 3 + Math.random() * 5,
      });
    }
    while (thorSkillTrailParticles.length > 56) thorSkillTrailParticles.shift();
  }

  function updateThorSkillTrail(dt, t) {
    for (let i = thorSkillTrailParticles.length - 1; i >= 0; i--) {
      const p = thorSkillTrailParticles[i];
      p.life -= dt;
      p.x0 += p.vx * dt;
      p.y0 += p.vy * dt;
      p.x1 += p.vx * 0.94 * dt;
      p.y1 += p.vy * 0.94 * dt;
      p.vx *= 1 - 0.35 * dt;
      p.vy *= 1 - 0.35 * dt;
      if (p.life <= 0) thorSkillTrailParticles.splice(i, 1);
    }
    emitThorTrailParticlesFor(player);
    if (isCoopMode) emitThorTrailParticlesFor(player2);
  }

  function getRoninSwordQiDamage(src = player) {
    return Math.max(1, Math.round((getPlayerDamage(src) * 3) / 2));
  }

  /** 流浪剑客狂暴：每次按下 J 发出普攻时立刻射一道剑气（不必命中）；有敌人则瞄最近，否则朝面向 */
  function spawnRoninSwordQiOnNormalAttack(source = player) {
    if (!source || source.state !== 'alive') return;
    if (!roninMode || gunnerMode || !source.godRageActive) return;
    const pcx = source.x + config.playerWidth / 2;
    const pcy = source.y + config.playerHeight * 0.42;
    const alive = enemies.filter((e) => e.hp > 0);
    let dx;
    let dy;
    if (alive.length) {
      let best = null;
      let bestD = 1e9;
      for (const e of alive) {
        const ecx = e.x + e.width / 2;
        const ecy = e.y + e.height / 2;
        const d = (ecx - pcx) ** 2 + (ecy - pcy) ** 2;
        if (d < bestD) {
          bestD = d;
          best = e;
        }
      }
      const tcx = best.x + best.width / 2;
      const tcy = best.y + best.height / 2;
      dx = tcx - pcx;
      dy = tcy - pcy;
    } else {
      const dir = source.facing || 1;
      dx = dir;
      dy = 0;
    }
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const spd = 540;
    const qiDmg = getRoninSwordQiDamage(source);
    roninSwordQi.push({
      x: pcx + (dx / len) * 32,
      y: pcy + (dy / len) * 6,
      vx: (dx / len) * spd,
      vy: (dy / len) * spd,
      damage: qiDmg,
      rot: Math.atan2(dy, dx),
      /** 已受过本道剑气伤害的敌人 id，穿透不重复结算 */
      hitIds: new Set(),
    });
    screenShakeSwordQiCast();
  }

  function updateRoninSwordQi(dt, t) {
    if (!roninMode) {
      roninSwordQi.length = 0;
      return;
    }

    const hw = 26;
    const hh = 10;
    const wallPad = 36;
    for (let i = roninSwordQi.length - 1; i >= 0; i--) {
      const q = roninSwordQi[i];
      if (!q.hitIds) q.hitIds = new Set();
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      // 穿透：仅出屏/撞「墙」时消失，不按时间衰减
      if (
        q.x < -wallPad ||
        q.x > config.width + wallPad ||
        q.y < -wallPad ||
        q.y > config.height + wallPad
      ) {
        roninSwordQi.splice(i, 1);
        continue;
      }
      const cos = Math.cos(q.rot);
      const sin = Math.sin(q.rot);
      const corners = [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh },
      ];
      for (const enemy of enemies) {
        if (enemy.hp <= 0) continue;
        if (q.hitIds.has(enemy.id)) continue;
        if (enemy.invulnerableUntil && t < enemy.invulnerableUntil) continue;
        const eBox = getEnemyHitbox(enemy);
        let overlap = false;
        for (const c of corners) {
          const wx = q.x + c.x * cos - c.y * sin;
          const wy = q.y + c.x * sin + c.y * cos;
          if (wx >= eBox.left && wx <= eBox.right && wy >= eBox.top && wy <= eBox.bottom) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          const mcx = q.x;
          const mcy = q.y;
          if (mcx >= eBox.left && mcx <= eBox.right && mcy >= eBox.top && mcy <= eBox.bottom) {
            overlap = true;
          }
        }
        if (!overlap) continue;

        q.hitIds.add(enemy.id);
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.06 });
        spawnBleedEffect(enemy);
        const hpBefore = enemy.hp;
        enemy.hp = Math.max(0, enemy.hp - q.damage);
        enemy.hurtEnd = t + 0.08;
        if (hpBefore > 0 && enemy.hp <= 0) {
          spawnBerserkerKillGoldBeam(enemy);
        }
        if (hpBefore > 0 && enemy.hp <= 0) {
          const anyAlive = enemies.some((e) => e.hp > 0);
          if (anyAlive) addKillImpactScreenShake(enemy);
          else if (!slowMotionTimer) triggerSlowMotion(cx, cy, !!enemy.isBoss);
        }
        enemy.vx += Math.cos(q.rot) * 200;
        enemy.vy -= 60;
      }
    }
  }


  function getXianglongDamage(source = player) {
    let d = getPlayerDamage(source);
    if (source && source.godRageActive && getCurrentGodSkillTier() === 'martial') {
      d /= 2;
    }
    return Math.max(1, Math.round(d * XIANGLONG_DRAGON_DAMAGE_MUL));
  }

  function spawnXianglongDragonPalmOnNormalAttack(source = player) {
    if (!source || source.state !== 'alive') return;
    if (!martialMode || !source.godRageActive) return;
    const pcx = source.x + config.playerWidth / 2;
    const pcy = source.y + config.playerHeight * 0.42;
    const alive = enemies.filter((e) => e.hp > 0);
    let dx = source.facing || 1;
    let dy = 0;
    if (alive.length) {
      let best = null;
      let bestD = 1e9;
      for (const e of alive) {
        const ecx = e.x + e.width / 2;
        const ecy = e.y + e.height / 2;
        const d = (ecx - pcx) ** 2 + (ecy - pcy) ** 2;
        if (d < bestD) {
          bestD = d;
          best = e;
        }
      }
      dx = best.x + best.width / 2 - pcx;
      dy = best.y + best.height / 2 - pcy;
    }
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const rot = Math.atan2(uy, ux);
    xianglongDragonPalms.push({
      x: pcx + ux * 42,
      y: pcy - 54 + uy * 10,
      vx: ux * XIANGLONG_DRAGON_SPEED,
      vy: uy * XIANGLONG_DRAGON_SPEED * 0.42,
      rot,
      life: 1.45,
      maxLife: 1.45,
      scale: 0.56,
      damage: getXianglongDamage(source),
      owner: source,
      hitIds: new Set(),
    });
    for (let i = 0; i < 18; i++) {
      xianglongPalmWaves.push({
        x: pcx + ux * (36 + i * 9),
        y: pcy + Math.sin(i * 0.85) * 18,
        vx: ux * (330 + i * 12),
        vy: uy * 90,
        r: 10 + i * 1.2,
        life: 0.45 + i * 0.02,
        maxLife: 0.45 + i * 0.02,
        rot,
      });
    }
    for (let i = 0; i < 36; i++) {
      xianglongSparks.push({
        x: pcx + ux * 50,
        y: pcy + (Math.random() - 0.5) * 34,
        vx: ux * (180 + Math.random() * 420) + (Math.random() - 0.5) * 90,
        vy: -110 + Math.random() * 220,
        life: 0.28 + Math.random() * 0.45,
        maxLife: 0.55,
        size: 2 + Math.random() * 3,
        cyan: Math.random() < 0.5,
      });
    }
    screenShake(220, 8, true);
  }

  function updateXianglongDragonPalms(dt, t) {
    if (!martialMode) {
      xianglongDragonPalms.length = 0;
      xianglongPalmWaves.length = 0;
      xianglongSparks.length = 0;
      return;
    }
    for (let i = xianglongPalmWaves.length - 1; i >= 0; i--) {
      const w = xianglongPalmWaves[i];
      w.x += w.vx * dt;
      w.y += w.vy * dt;
      w.r += 80 * dt;
      w.life -= dt;
      if (w.life <= 0) xianglongPalmWaves.splice(i, 1);
    }
    for (let i = xianglongSparks.length - 1; i >= 0; i--) {
      const s = xianglongSparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 240 * dt;
      s.life -= dt;
      if (s.life <= 0) xianglongSparks.splice(i, 1);
    }
    const wallPad = 180;
    for (let i = xianglongDragonPalms.length - 1; i >= 0; i--) {
      const d = xianglongDragonPalms[i];
      if (!d.hitIds) d.hitIds = new Set();
      d.x += d.vx * dt;
      d.y += d.vy * dt + Math.sin((d.maxLife - d.life) * 13) * 0.8;
      d.life -= dt;
      if (
        d.life <= 0 ||
        d.x < -wallPad ||
        d.x > config.width + wallPad ||
        d.y < -wallPad ||
        d.y > config.height + wallPad
      ) {
        xianglongDragonPalms.splice(i, 1);
        continue;
      }
      const dragonBox = {
        left: d.x - 18,
        right: d.x + 220 * d.scale,
        top: d.y + 52 * d.scale,
        bottom: d.y + 190 * d.scale,
      };
      for (const enemy of enemies) {
        if (enemy.hp <= 0) continue;
        if (d.hitIds.has(enemy.id)) continue;
        if (enemy.invulnerableUntil && t < enemy.invulnerableUntil) continue;
        if (!boxesOverlap(dragonBox, getEnemyHitbox(enemy))) continue;
        d.hitIds.add(enemy.id);
        const hpBefore = enemy.hp;
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        enemy.hp = Math.max(0, enemy.hp - d.damage);
        enemy.hurtEnd = t + 0.12;
        enemy.vx += Math.sign(d.vx || 1) * 320;
        enemy.vy -= 120;
        hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.1 });
        spawnBleedEffect(enemy);
        for (let k = 0; k < 14; k++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 320,
            vy: -160 - Math.random() * 160,
            life: 0.38,
            maxLife: 0.38,
            isRageGold: true,
          });
        }
        if (hpBefore > 0 && enemy.hp <= 0) spawnBerserkerKillGoldBeam(enemy);
        if (hpBefore > 0 && enemy.hp <= 0) {
          const anyAlive = enemies.some((e) => e.hp > 0);
          if (anyAlive) addKillImpactScreenShake(enemy);
          else if (!slowMotionTimer) triggerSlowMotion(cx, cy, !!enemy.isBoss);
        } else {
          screenShake(90, 4.5, true);
        }
      }
    }
  }

  function updateRoninFootTrail(dt, t) {
    for (let i = roninFootTrailParticles.length - 1; i >= 0; i--) {
      const p = roninFootTrailParticles[i];
      p.life -= dt;
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      if (p.life <= 0) roninFootTrailParticles.splice(i, 1);
    }
    if (!roninMode || gunnerMode || player.state !== 'alive') return;
    if (player.onGround && Math.abs(player.vx) > 16) {
      const rate = Math.min(1, Math.abs(player.vx) / 220) * 0.95;
      if (Math.random() < rate * dt * 70) {
        const fx =
          player.x +
          config.playerWidth * 0.28 +
          Math.random() * config.playerWidth * 0.44;
        const fy = player.y + config.playerHeight - 5;
        const ml = 0.32 + Math.random() * 0.22;
        roninFootTrailParticles.push({
          x: fx,
          y: fy,
          vx: (Math.random() - 0.5) * 55,
          vy: -28 - Math.random() * 45,
          life: ml,
          maxLife: ml,
          size: 2 + Math.random() * 2.8,
        });
      }
    }
    while (roninFootTrailParticles.length > 52) roninFootTrailParticles.shift();
  }

  function spawnRoninOmnislashOnMeleeHit(enemy, t) {
    if (!roninMode || !enemy) return;
    const ecx = enemy.x + enemy.width / 2;
    const ecy = enemy.y + enemy.height * 0.42;
    const pcx = player.x + config.playerWidth / 2;
    const pcy = player.y + config.playerHeight * 0.38;
    const rdx = ecx - pcx;
    const rdy = ecy - pcy;
    const baseAng = Math.atan2(rdy, rdx);
    const n = 24 + Math.floor(Math.random() * 12);
    for (let i = 0; i < n; i++) {
      const ang = baseAng + (Math.random() - 0.5) * 1.35;
      const sp = 300 + Math.random() * 480;
      const lf = 0.16 + Math.random() * 0.18;
      hitParticles.push({
        x: ecx + (Math.random() - 0.5) * 20,
        y: ecy + (Math.random() - 0.5) * 24,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: lf,
        maxLife: lf,
        noGravity: true,
        isRoninSlash: true,
        slashL: 20 + Math.random() * 34,
        slashW: 2 + Math.random() * 3.2,
      });
    }
  }

  function hasBuff(id) { return playerBuffs.includes(id); }
  function getPlayerDamage(fromPlayer = player) {
    let d = config.attackDamage * (hasBuff('atk') ? 1.2 : 1);
    if (berserkerMode) d *= 2;
    if (angelMode) d *= 2;
    if (demonMode) d *= 2;
    if (thorMode) d *= 2;
    if (
      fromPlayer &&
      fromPlayer.godRageActive &&
      (getCurrentGodSkillTier() === 'berserker' ||
        getCurrentGodSkillTier() === 'ronin' ||
        getCurrentGodSkillTier() === 'gunner' ||
        getCurrentGodSkillTier() === 'martial')
    ) {
      d *= 2;
    }
    if (starterRunBuff === 'atk') d *= 1.2;
    return d;
  }
  function getPlayerKnockbackSpeed() {
    let k = config.baseKnockbackX * (hasBuff('knockback') ? 1.5 : 1);
    if (berserkerMode) k *= 1.5;
    if (angelMode) k *= 2;
    if (demonMode) k *= 2;
    if (thorMode) k *= 2;
    if (starterRunBuff === 'knock') k *= 1.25;
    return k;
  }
  function getPlayerLifestealRatio() {
    return hasBuff('lifesteal') ? 0.05 : 0;
  }
  function getPlayerAttackCooldownScale() {
    let s = hasBuff('atkSpeed') ? 0.85 : 1;
    if (berserkerMode) s *= 0.2;
    if (angelMode) s *= 0.5;
    if (demonMode) s *= 0.5;
    if (thorMode) s *= 0.5;
    if (starterRunBuff === 'atkspd') s *= 0.85;
    return s;
  }

  function syncPlayerHpCapAndFill() {
    let max = config.playerMaxHp;
    if (isVersusMode) max *= config.versusMaxHpMul;
    if (berserkerMode) max *= 3;
    if (angelMode) max *= 2;
    if (demonMode) max *= 2;
    if (thorMode) max *= 2;
    if (gunnerMode) max *= 2;
    if (martialMode) max *= 1.25;
    if (starterRunBuff === 'hp') max *= 1.25;
    const rounded = Math.max(1, Math.round(max));
    player.maxHp = rounded;
    if (player.state === 'alive') player.hp = player.maxHp;
    else player.hp = 0;
    if (isCoopMode) {
      player2.maxHp = rounded;
      if (player2.state === 'alive') player2.hp = player2.maxHp;
      else player2.hp = 0;
    }
  }

  function rollRandomBuff() {
    const available = buffs.filter((b) => !playerBuffs.includes(b.id));
    if (available.length === 0) return null;
    const picked = available[Math.floor(Math.random() * available.length)];
    playerBuffs.push(picked.id);
    return picked;
  }

  // 通关结算专用：优先 Funk（把 mp3 放到 assets/victory_funk.mp3），否则回退 MONTAGEM
  const VICTORY_CLEAR_MP3_BASENAMES = ['victory_funk.mp3', 'MONTAGEM_ALQUIMIA_1.mp3'];
  function getVictoryClearMp3UrlCandidates() {
    const out = [];
    const seen = new Set();
    for (const name of VICTORY_CLEAR_MP3_BASENAMES) {
      for (const u of ['assets/' + name, 'assets/' + encodeURIComponent(name)]) {
        if (!seen.has(u)) {
          seen.add(u);
          out.push(u);
        }
      }
    }
    return out;
  }

  const GAMEPLAY_BGM_URL_CANDIDATES = [
    'assets/aderdasilva-ader-da-silva-naval-proeminence-1450.mp3',
    'assets/' + encodeURIComponent('aderdasilva-ader-da-silva-naval-proeminence-1450.mp3'),
  ];
  /** @type {{ type: 'buffer', source: AudioBufferSourceNode, gain?: GainNode } | { type: 'html', el: HTMLAudioElement } | { type: 'media', el: HTMLAudioElement, mes: MediaElementAudioSourceNode, gain?: GainNode } | null} */
  let settlementAudioHandle = null;

  // ========== 关卡循环 BGM（GAMEPLAY_BGM_URL_CANDIDATES） ==========
  const BGM = {
    ctx: null,
    masterGain: null,
    source: null,
    started: false,
    /** 防止并发 `start()` 各起一路 decode+BufferSource，导致多轨 BGM 叠放 */
    loadPromise: null,

    ensureMasterGain() {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t0 = this.ctx.currentTime;
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.25, t0);
        this.masterGain.connect(this.ctx.destination);
        bgmMasterGain = this.masterGain;
      }
    },

    async start() {
      if (gameState === 'settlement') return;
      // 结算界面打开时不要重复起第二路 BGM（结算逻辑会接管音量或补播）
      if (settlementOverlay && !settlementOverlay.classList.contains('hidden')) return;
      // 已经有 source 在播就只做 resume
      if (this.source) {
        if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
        if (this.masterGain) {
          const t = this.ctx.currentTime;
          this.masterGain.gain.cancelScheduledValues(t);
          this.masterGain.gain.setValueAtTime(0.25, t);
        }
        return;
      }
      if (!this.loadPromise) {
        this.loadPromise = (async () => {
          try {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') await this.ctx.resume();
            this.ensureMasterGain();
            this.stopGameplayLoop();

            const urls = GAMEPLAY_BGM_URL_CANDIDATES;
            let loaded = false;
            for (const url of urls) {
              try {
                const res = await fetch(url);
                if (!res.ok) continue;
                const buf = await res.arrayBuffer();
                const audioBuf = await this.ctx.decodeAudioData(buf);
                this.source = this.ctx.createBufferSource();
                this.source.buffer = audioBuf;
                this.source.loop = true;
                this.source.connect(this.masterGain);
                this.source.start(0);
                this.started = true;
                loaded = true;
                {
                  const t = this.ctx.currentTime;
                  this.masterGain.gain.cancelScheduledValues(t);
                  this.masterGain.gain.setValueAtTime(0.25, t);
                }
                console.log('BGM loaded and started:', url);
                break;
              } catch (e) {
                console.warn('BGM fetch/decode failed:', url, e);
              }
            }
            if (!loaded) {
              this.started = false;
              console.warn('BGM load failed: all candidates failed', urls);
            }
          } finally {
            this.loadPromise = null;
          }
        })();
      }
      await this.loadPromise;
      if (this.source && this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
      if (this.source && this.masterGain && this.ctx) {
        const t = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(t);
        this.masterGain.gain.setValueAtTime(0.25, t);
      }
    },

    update(dt, t, stageIndex) {
      if (!this.started || !this.ctx || !this.masterGain) return;
      const phase = stageIndex < 2 ? 'explore' : stageIndex === 2 ? 'elite' : 'boss';
      const vol = phase === 'boss' ? 0.28 : 0.25;
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.5);
    },

    /** 停止当前 BGM 的 BufferSource（结算需另起一路播放时用） */
    stopGameplayLoop() {
      try {
        if (this.source && this.ctx) {
          const t = this.ctx.currentTime;
          this.source.stop(t);
          this.source.disconnect();
        } else if (this.source) {
          this.source.stop(0);
          this.source.disconnect();
        }
      } catch (_) {
        /* BufferSource 可能已 stop */
      }
      this.source = null;
      this.started = false;
    },

    /** 立刻掐掉关卡循环 BGM（同一时刻总线静音，避免与结算曲叠放） */
    cutGameplayMusicNow() {
      this.stopGameplayLoop();
      this.silenceMasterCompletely();
    },

    /** 关卡 BGM 总线瞬间静音（与 stopGameplayLoop 配合 = 关卡音乐全关） */
    silenceMasterCompletely() {
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(0, t);
    },
  };

  function stopSettlementScreenMusic() {
    if (!settlementAudioHandle) return;
    try {
      if (settlementAudioHandle.type === 'html') {
        const el = settlementAudioHandle.el;
        el.pause();
        el.currentTime = 0;
        el.src = '';
        el.load();
      } else if (settlementAudioHandle.type === 'media') {
        const el = settlementAudioHandle.el;
        el.pause();
        el.currentTime = 0;
        settlementAudioHandle.mes.disconnect();
        if (settlementAudioHandle.gain) settlementAudioHandle.gain.disconnect();
        el.src = '';
        el.load();
      } else {
        try {
          settlementAudioHandle.source.stop(0);
        } catch (_) {
          /* BufferSource 可能已 stop */
        }
        settlementAudioHandle.source.disconnect();
        if (settlementAudioHandle.gain) settlementAudioHandle.gain.disconnect();
      }
    } catch (_) {
      /* ignore */
    }
    settlementAudioHandle = null;
  }

  /** 通关 / 死亡结算：立刻停关卡 BGM，经独立音量节点播放结算曲（与关卡 masterGain 完全分离） */
  async function playSettlementScreenMusic() {
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();

    const urlCandidates = getVictoryClearMp3UrlCandidates();
    console.log('=== 结算 / Funk 音乐：关卡 BGM 已切断，尝试播放 ===');
    console.log('候选路径:', urlCandidates);

    const ctx = ensureAudio();
    console.log('AudioContext 状态(前):', ctx.state);

    try {
      await ctx.resume();
      console.log('AudioContext 状态(resume 后):', ctx.state);
    } catch (e) {
      console.error('AudioContext resume 失败:', e);
    }

    const settlementOutGain = ctx.createGain();
    settlementOutGain.connect(ctx.destination);
    {
      const t = ctx.currentTime;
      settlementOutGain.gain.setValueAtTime(0.92, t);
    }

    // 方式1: Web Audio API — 独立 settlementOutGain，不经过关卡 BGM 的 masterGain
    for (const url of urlCandidates) {
      try {
        console.log('尝试 fetch:', url);
        const res = await fetch(url);
        if (!res.ok) {
          console.warn('HTTP 失败:', res.status, url);
          continue;
        }
        console.log('fetch 成功，开始解码...');
        const raw = await res.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(raw);
        console.log('解码成功，时长:', audioBuf.duration, '秒');
        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        source.loop = true;
        source.connect(settlementOutGain);
        source.start(0);
        settlementAudioHandle = { type: 'buffer', source, gain: settlementOutGain };
        console.log('=== 结算音乐播放成功 (独立总线 → destination) ===');
        return;
      } catch (e) {
        console.error('Web Audio 失败:', url, e);
      }
    }

    settlementOutGain.disconnect();

    const settlementOutGain2 = ctx.createGain();
    settlementOutGain2.connect(ctx.destination);
    {
      const t = ctx.currentTime;
      settlementOutGain2.gain.setValueAtTime(0.92, t);
    }

    // 方式2: HTMLAudio + MediaElementSource → 独立增益
    for (const url of urlCandidates) {
      try {
        console.log('尝试 HTMLAudio→settlementOut:', url);
        const a = new Audio(url);
        a.loop = true;
        const mes = ctx.createMediaElementSource(a);
        mes.connect(settlementOutGain2);
        settlementAudioHandle = { type: 'media', el: a, mes, gain: settlementOutGain2 };
        await a.play();
        console.log('=== 结算音乐播放成功 (HTMLAudio→独立总线) ===');
        return;
      } catch (e) {
        console.error('HTMLAudio→独立总线 失败:', url, e);
      }
    }

    settlementOutGain2.disconnect();

    // 方式3: 仅 HTMLAudio（不经过 masterGain，极端回退）
    for (const url of urlCandidates) {
      try {
        console.log('尝试 HTMLAudio 直连:', url);
        const a = new Audio(url);
        a.volume = 0.92;
        a.loop = true;
        settlementAudioHandle = { type: 'html', el: a };
        await a.play();
        console.log('=== 结算音乐播放成功 (HTMLAudio 直连) ===');
        return;
      } catch (e) {
        console.error('HTMLAudio 直连失败:', url, e);
      }
    }

    console.error('=== 结算音乐：所有方式全部失败！===');
    console.error(
      '请把通关结算用 mp3 放进 assets/，文件名需为下列之一:',
      VICTORY_CLEAR_MP3_BASENAMES.join(', ')
    );
  }
  let ambientStarted = false;
  let bgmMasterGain = null;
  function ensureAudio() {
    if (!BGM.ctx) BGM.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return BGM.ctx;
  }
  function resumeGameAudio() {
    const ctx = ensureAudio();
    if (ctx.state === 'suspended') void ctx.resume();
  }
  function startAmbientLoop() {
    GunnerHeadshotSfx.ensureLoad();
    GunnerShootSfx.ensureLoad();
    BGM.start();
    ambientStarted = true;
  }
  void GunnerHeadshotSfx.ensureLoad();
  void GunnerShootSfx.ensureLoad();
  function triggerBossPhase2Music() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    if (bgmMasterGain) {
      bgmMasterGain.gain.cancelScheduledValues(t);
      bgmMasterGain.gain.setValueAtTime(0.22, t);
      bgmMasterGain.gain.linearRampToValueAtTime(0.2, t + 3);
    }
    const playDrum = () => {
      const t2 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, t2);
      osc.frequency.exponentialRampToValueAtTime(30, t2 + 0.12);
      gain.gain.setValueAtTime(0.15, t2);
      gain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.12);
      osc.start(t2);
      osc.stop(t2 + 0.12);
    };
    playDrum();
    setTimeout(playDrum, 1000);
    setTimeout(playDrum, 2000);
  }
  // 僵尸接近低吼
  function playZombieGrowl() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(120, t);
    osc.connect(lpf);
    lpf.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // 超级拳发动音效（按 K 时播放，更重低音）
  function playSuperPunchSound() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.2);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 攻击命中三层音效
  function playHitSound() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;

    // 1. 低频短促震动音（80Hz，0.1s）
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, t);
    osc1.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    gain1.gain.setValueAtTime(0.1, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc1.start(t);
    osc1.stop(t + 0.1);

    // 2. 高频短脉冲（1000Hz，0.05s）
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1000, t);
    gain2.gain.setValueAtTime(0.06, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc2.start(t);
    osc2.stop(t + 0.05);

    // 3. 空挥音（频率轻微下降）
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(400, t);
    osc3.frequency.exponentialRampToValueAtTime(180, t + 0.12);
    gain3.gain.setValueAtTime(0.08, t);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc3.start(t);
    osc3.stop(t + 0.12);
  }

  // 连招命中音效：按段数增强（J 三段）
  function playComboHitSound(step) {
    const s = step || 1;
    playHitSound();
    const ctx = ensureAudio();
    const t = ctx.currentTime;

    // 第二段：稍微加重低频
    if (s === 2) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.09);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.start(t);
      osc.stop(t + 0.09);
    }

    // 第三段：最重，接近超级拳的感觉
    if (s === 3) {
      playSuperPunchSound();
      // 再叠一层更低的低频，让“终结”更有压迫感
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    }
  }

  function playBlockSound() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;

    // 低频"咚"声（敲门的主体）
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(50, t + 0.12);
    gain1.gain.setValueAtTime(0.18, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc1.start(t);
    osc1.stop(t + 0.15);

    // 木质共振（让敲门声更真实）
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(200, t);
    osc2.frequency.exponentialRampToValueAtTime(100, t + 0.08);
    gain2.gain.setValueAtTime(0.08, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc2.start(t);
    osc2.stop(t + 0.1);

    // 敲击瞬间的噪声（模拟木头被敲的质感）
    const bufSize = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufSize * 5);
    const ns = ctx.createBufferSource();
    ns.buffer = buf;
    const ng = ctx.createGain();
    ns.connect(ng);
    ng.connect(ctx.destination);
    ng.gain.setValueAtTime(0.1, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    ns.start(t);
    ns.stop(t + 0.05);
  }

  /** 震屏时播放：短促木门敲击感（与 playBlockSound 同系，更短更干） */
  function playScreenShakeKnockSound(ampPx) {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    const w = Math.max(0.4, Math.min(1.25, (ampPx == null ? 8 : ampPx) / 9));

    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.connect(g1);
    g1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(88 + w * 18, t);
    osc1.frequency.exponentialRampToValueAtTime(42, t + 0.07);
    g1.gain.setValueAtTime(0.1 * w, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc1.start(t);
    osc1.stop(t + 0.11);

    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(210, t);
    osc2.frequency.exponentialRampToValueAtTime(95, t + 0.035);
    g2.gain.setValueAtTime(0.055 * w, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
    osc2.start(t);
    osc2.stop(t + 0.06);

    const bufSize = Math.floor(ctx.sampleRate * 0.024);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufSize * 6);
    }
    const ns = ctx.createBufferSource();
    ns.buffer = buf;
    const ng = ctx.createGain();
    ns.connect(ng);
    ng.connect(ctx.destination);
    ng.gain.setValueAtTime(0.075 * w, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.032);
    ns.start(t);
    ns.stop(t + 0.04);
  }

  function playPerfectBlockSound() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(740, t);
    osc.frequency.exponentialRampToValueAtTime(1240, t + 0.08);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.11, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  function playDodgeSound() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;

    // 风扇叶片划过的音调变化：低→高→低
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'bandpass';
    lp.frequency.setValueAtTime(1500, t);
    lp.Q.setValueAtTime(2, t);
    osc1.connect(lp);
    lp.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(200, t);
    osc1.frequency.exponentialRampToValueAtTime(900, t + 0.08);
    osc1.frequency.exponentialRampToValueAtTime(400, t + 0.2);
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(0.07, t + 0.04);
    gain1.gain.setValueAtTime(0.07, t + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc1.start(t);
    osc1.stop(t + 0.22);

    // 风声噪音层（让嗖声更自然像真正的风）
    const bufSize = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = Math.sin(i / bufSize * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const ns = ctx.createBufferSource();
    ns.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2000, t);
    bp.Q.setValueAtTime(1.5, t);
    const ng = ctx.createGain();
    ns.connect(bp);
    bp.connect(ng);
    ng.connect(ctx.destination);
    ng.gain.setValueAtTime(0.04, t);
    ng.gain.linearRampToValueAtTime(0.06, t + 0.06);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    ns.start(t);
    ns.stop(t + 0.2);
  }

  function playComboChime() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    const notes = [880, 1175, 1568];
    notes.forEach((freq, i) => {
      const tt = t + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, tt);
      gain.gain.setValueAtTime(0.001, tt);
      gain.gain.linearRampToValueAtTime(0.08, tt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, tt + 0.12);
      osc.start(tt);
      osc.stop(tt + 0.13);
    });
  }

  // ========== 慢动作终结技音效 ==========
  function playSlowMotionSound() {
    const ctx = ensureAudio();
    const t = ctx.currentTime;
    // 低沉的时间扭曲音（低→更低）
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.5);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  // ========== 摄像机（lerp 滞后跟随） ==========
  let cameraX = 0;

  // ========== 闪电效果 ==========
  let lightningFlashRemain = 0;
  let nextLightningTime = 12;
  let comboFlashRemain = 0;
  let hpStrategyFlashRemain = 0;
  let perfectBlockFlashRemain = 0;

  // ========== Boss 登场 ==========
  let bossIntroDarkTimer = 0;
  let bossIntroLabelTimer = 0;

  // ========== 玩家死亡暗屏计时 ==========
  let deathDarkTimer = 0;
  /** 双人：用于在「两人均死亡」瞬间把暗屏计时清零，再开始结算倒计时 */
  let coopBothDeadPrev = false;

  // ========== 屏幕震动（可叠加强度；按真实时间衰减） ==========
  let shakeRemain = 0;
  let shakeAmount = 0;
  /** 本次震动峰值时长（ms），用于包络衰减 */
  let shakePeakMs = 0;
  /** 敲门音节流（ms），避免同一瞬间多次 screenShake 连播刺耳 */
  let lastShakeKnockAtMs = 0;
  function screenShake(durationMs, amountPx, silent) {
    const d = durationMs != null ? durationMs : config.screenShakeDuration;
    const a = amountPx != null ? amountPx : config.screenShakeAmount;
    shakeRemain = Math.max(shakeRemain, d);
    shakePeakMs = Math.max(shakePeakMs, d);
    shakeAmount = Math.max(shakeAmount, a);
    if (silent) return;
    const nowMs = performance.now();
    if (nowMs - lastShakeKnockAtMs >= 44) {
      lastShakeKnockAtMs = nowMs;
      try {
        playScreenShakeKnockSound(a);
      } catch (_) { /* ignore */ }
    }
  }

  /** 非清场击杀：小怪/ Boss 不同力度；清场交给慢动作已有震屏 */
  function addKillImpactScreenShake(enemy) {
    if (!enemy) return;
    if (!enemies.some((e) => e.hp > 0)) return;
    if (enemy.isBoss) {
      screenShake(230, config.screenShakeKillBossAmp);
    } else {
      screenShake(115, config.screenShakeKillMobAmp);
    }
  }

  /** 流浪剑客剑气出手瞬间的短促抖击 */
  function screenShakeSwordQiCast() {
    screenShake(68, config.screenShakeSwordQiAmp);
  }

  // ========== Hitstop ==========
  let hitstopRemain = 0;
  function doHitstop() {
    hitstopRemain = config.hitstopMs / 1000;
  }

  // ========== 慢动作终结技 ==========
  function triggerSlowMotion(impactX, impactY, isBoss) {
    if (slowMotionTimer > 0) return; // 已在慢动作中
    slowMotionTimer = slowMotionDuration; // 秒（真实时间）
    slowMotionScale = 0.15;
    slowMotionImpact = { x: impactX, y: impactY };
    slowMotionFinishIsBoss = !!isBoss;
    playSlowMotionSound();
  }

  // ========== 连招数据（J 三段） ==========
  const comboData = [
    { name: 'jab',      damageMul: 1.0, knockbackMul: 1.0, dashForce: 100, duration: 0.15, cooldown: 0.12 },
    { name: 'cross',    damageMul: 1.3, knockbackMul: 1.2, dashForce: 140, duration: 0.18, cooldown: 0.15 },
    { name: 'uppercut', damageMul: 1.8, knockbackMul: 1.8, dashForce: 180, duration: 0.22, cooldown: 0.20 },
  ];

  // ========== 玩家 ==========
  const player = {
    x: 120,
    y: config.groundY - config.playerHeight,
    vx: 0,
    vy: 0,
    hp: config.playerMaxHp,
    maxHp: config.playerMaxHp,
    facing: 1,
    state: 'alive', // 'alive' | 'dead'
    anim: 'idle',   // 'idle' | 'run' | 'attack'
    attackStart: 0,
    attackCooldownEnd: 0,
    currentAttackId: 0,
    onGround: true,
    // 超级拳（K键大招）相关
    superAttackFrame: 0,
    superAttackFrameCount: 4,      // 4 帧
    superAttackFrameWidth: 28,     // 112 / 4 = 28
    superAttackFrameHeight: 16,
    superAttackDuration: 400,      // 动画持续 400ms
    superAttackTimer: 0,
    isSuperAttacking: false,
    superAttackCooldown: 0,        // 开始时无冷却，可以立刻放一次
    superAttackCooldownMax: 3000,  // 3 秒冷却
    isDodging: false,
    dodgeTimer: 0,
    dodgeCooldown: 0,
    dodgeSpeed: 600,
    dodgeDuration: 0.15,
    dodgeCooldownMax: config.playerDodgeCooldown,
    dodgeDir: 1,
    dodgeTrailTimer: 0,
    dodgeTriggerCount: 0, // 仅在显式按下 Shift / HUD 闪按钮时触发一次，避免“排队后自动闪”
    dodgeHoldRepeat: 0,
    knockbackEnd: 0,
    isBlocking: false,
    blockFlashTimer: 0,
    blockFlashColor: '#ffffff',
    blockShakeTimer: 0,
    shieldGoldTimer: 0,
    shieldPulseTimer: 0,
    shieldPulseAge: 0,
    shieldPulseActive: false,
    blockStartTime: 0,
    blockLastPressTime: -1e9,
    perfectBlockWindow: 0.04,
    shiftHeldLast: false,
    blockHeldLast: false,
    combo: 0,
    // ========== 连招系统（J 三段） ==========
    comboStep: 0,        // 当前连招段数（0=不在连招，1/2/3=正在对应段）
    comboTimer: 0,       // 连招窗口剩余时间（真实时间）
    comboWindowMax: 0.6, // 连招输入窗口（秒）
    comboActiveStep: 0,  // 最近一次开始攻击的段（用于音效/击中UI）
    comboUiStep: 0,      // 连招命中UI显示的段（1/2/3）
    comboUiTimer: 0,     // 连招命中UI剩余时间（秒）
    jHeldLast: false,    // 用于检测“按下事件”而不是长按
    comboNextDeadline: 0,// 下一次连招输入的截止时间（真实时间）

    // 连招/出拳的每段持续时间与冷却（秒）
    attackDurationSec: config.attackDuration / 1000,
    currentAttackStepCooldownMul: 1,
    gunCooldown: 0,
    gunCooldownMs: 500,
    gunShootTimer: 0,
    gunShootDuration: 360,
    gunnerShootCd: 0,
    gunnerShootOnlyAnim: false,
    gunnerAimAngle: 0,
    coopFriendlyLastHitAttackId: -1,
    /** 神迹状态（G / 左下条）：每人独立，互不干扰 */
    godRageActive: false,
    godThorMoveActive: false,
    godDemonFlyRemain: 0,
    godAngelSummonActive: false,
    godAngelMinions: [],
  };

  // 双人模式 2P（方向键移动，B普攻，N超级拳，M格挡，C战技）
  const player2 = {
    x: 180,
    y: config.groundY - config.playerHeight,
    vx: 0,
    vy: 0,
    hp: config.playerMaxHp,
    maxHp: config.playerMaxHp,
    facing: 1,
    state: 'alive',
    anim: 'idle',
    onGround: true,
    isBlocking: false,
    blockFlashTimer: 0,
    blockFlashColor: '#ffffff',
    blockShakeTimer: 0,
    shieldGoldTimer: 0,
    shieldPulseTimer: 0,
    shieldPulseAge: 0,
    shieldPulseActive: false,
    blockStartTime: 0,
    blockLastPressTime: -1e9,
    perfectBlockWindow: 0.04,
    isDodging: false,
    dodgeTimer: 0,
    dodgeCooldown: 0,
    dodgeSpeed: 600,
    dodgeDuration: 0.15,
    dodgeCooldownMax: config.playerDodgeCooldown,
    dodgeDir: 1,
    dodgeTrailTimer: 0,
    dodgeTriggerCount: 0,
    knockbackEnd: 0,
    attackStart: 0,
    attackDurationSec: config.attackDuration / 1000,
    attackCooldownEnd: 0,
    currentAttackId: 0,
    isSuperAttacking: false,
    superAttackFrame: 0,
    superAttackFrameWidth: 28,
    superAttackFrameHeight: 16,
    superAttackTimer: 0,
    superAttackDuration: 400,
    superAttackCooldown: 0,
    superAttackCooldownMax: 3000,
    combo: 0,
    comboStep: 0,
    comboTimer: 0,
    comboWindowMax: 0.6,
    comboActiveStep: 0,
    comboUiStep: 0,
    comboUiTimer: 0,
    comboNextDeadline: 0,
    blockHeldLast: false,
    bHeldLast: false,
    coopFriendlyLastHitAttackId: -1,
    gunnerShootCd: 0,
    gunnerShootOnlyAnim: false,
    gunnerAimAngle: 0,
    godRageActive: false,
    godThorMoveActive: false,
    godDemonFlyRemain: 0,
    godAngelSummonActive: false,
    godAngelMinions: [],
  };

  // ========== 敌人 / 子弹容器 ==========
  const enemies = [];
  const projectiles = [];
  const bossAoes = [];
  const slashEffects = [];
  const punchWindEffects = [];
  const comboNameEffects = [];
  const hitFlashEffects = [];
  const hitParticles = [];
  /** 狂战士击杀：金色垂直光束降临在目标位置 */
  const berserkerDeathBeams = [];
  const perfectBlockParticles = [];
  const bloodStains = [];
  const bleedEffects = []; // 敌人被打中流血动画（shot sprites）
  const playerBullets = [];
  /** 子弹消失后残留的曳光火星，自然衰减完毕再删 */
  const gunnerBulletTrailRemnants = [];
  const headshotBurstEffects = [];
  const gunFireEffects = [];
  const dodgeAfterimages = [];
  const shieldParticles = [];
  const shieldSparks = [];
  const shieldParticlesP2 = [];
  const shieldSparksP2 = [];
  let lastSlashAttackId = -1;
  let lastSlashAttackIdP2 = -1;
  let nextEnemyId = 1;
  // ========== 慢动作终结技 ==========
  let slowMotionTimer = 0;            // 剩余慢动作时间（秒，真实时间）
  let slowMotionScale = 1;           // 当前时间缩放系数
  const slowMotionDuration = 1.5;   // 秒
  let slowMotionImpact = null;       // { x, y }：用于镜头缩放与冲击波
  let slowMotionFinishIsBoss = false;
  let gameState = 'menu'; // 'menu' | 'playing' | 'paused' | 'settlement'
  let menuSelectedIndex = 0;
  let gameMode = 'single'; // 'single' | 'coop' | 'versus'
  let isCoopMode = false;
  /** 1v1 竞技场：五局、无怪、无养成加成 */
  let isVersusMode = false;
  let versusPhase = 'fighting';
  let versusWinsP1 = 0;
  let versusWinsP2 = 0;
  let versusRoundsCompleted = 0;
  let versusIntermissionTimer = 0;
  let versusRoundArmed = false;
  let versusBannerKey = '';
  let menuCoopSubOpen = false;
  let menuCoopSubIndex = 0;
  let menuFloatTime = 0;
  let menuHintPulseTime = 0;
  let menuShowHelp = false;
  /** 主菜单 · 选项 子界面 */
  let menuOptionsOpen = false;
  let menuOptionIndex = 0;
  /** 开局暂停：按键说明（单人仅 P1；双人左右分栏） */
  let controlsHelpOpen = false;
  let controlsHelpIsCoop = false;
  function getMainMenuItemLabels() {
    return [
      tr('menu_single'),
      tr('menu_coop'),
      tr('menu_controls'),
      tr('menu_options'),
    ];
  }
  const menuAshParticles = Array.from({ length: 40 }, () => ({
    x: Math.random() * config.width,
    y: Math.random() * config.height,
    r: 1 + Math.random() * 2,
    vy: 12 + Math.random() * 24,
    vx: (Math.random() - 0.5) * 8,
    a: 0.2 + Math.random() * 0.45,
  }));

  // ========== 键盘输入 ==========
  const keys = {};
  window.addEventListener('keydown', (e) => {
    if (gameState === 'menu') {
      if (menuShowHelp) {
        menuShowHelp = false;
        e.preventDefault();
        return;
      }
      if (menuOptionsOpen) {
        if (e.code === 'Escape') {
          menuOptionsOpen = false;
          e.preventDefault();
          return;
        }
        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
          menuOptionIndex = (menuOptionIndex - 1 + 3) % 3;
          e.preventDefault();
          return;
        }
        if (e.code === 'KeyS' || e.code === 'ArrowDown') {
          menuOptionIndex = (menuOptionIndex + 1) % 3;
          e.preventDefault();
          return;
        }
        if (e.code === 'KeyJ' || e.code === 'Enter') {
          if (menuOptionIndex === 0) toggleGameLocale();
          else if (menuOptionIndex === 1) {
            coopFriendlyFireEnabled = !coopFriendlyFireEnabled;
            saveFriendlyFireSetting();
          } else {
            menuOptionsOpen = false;
          }
          e.preventDefault();
        }
        return;
      }
      if (menuCoopSubOpen) {
        if (e.code === 'Escape') {
          menuCoopSubOpen = false;
          e.preventDefault();
          return;
        }
        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
          menuCoopSubIndex = (menuCoopSubIndex - 1 + 2) % 2;
          e.preventDefault();
          return;
        }
        if (e.code === 'KeyS' || e.code === 'ArrowDown') {
          menuCoopSubIndex = (menuCoopSubIndex + 1) % 2;
          e.preventDefault();
          return;
        }
        if (e.code === 'KeyJ' || e.code === 'Enter') {
          menuCoopSubOpen = false;
          controlsHelpIsCoop = true;
          controlsHelpOpen = true;
          gameState = 'playing';
          startAmbientLoop();
          lastTime = performance.now();
          if (menuCoopSubIndex === 0) {
            resetGame({ versusArena: true });
          } else {
            gameMode = 'coop';
            isVersusMode = false;
            resetGame({});
          }
          e.preventDefault();
        }
        return;
      }
      const menuItems = getMainMenuItemLabels();
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        menuSelectedIndex = (menuSelectedIndex - 1 + menuItems.length) % menuItems.length;
        e.preventDefault();
        return;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        menuSelectedIndex = (menuSelectedIndex + 1) % menuItems.length;
        e.preventDefault();
        return;
      }
      if (e.code === 'KeyJ' || e.code === 'Enter') {
        if (menuSelectedIndex === 2) {
          menuShowHelp = true;
          e.preventDefault();
          return;
        }
        if (menuSelectedIndex === 3) {
          menuOptionsOpen = true;
          menuOptionIndex = 0;
          e.preventDefault();
          return;
        }
        if (menuSelectedIndex === 1) {
          menuCoopSubOpen = true;
          menuCoopSubIndex = 0;
          e.preventDefault();
          return;
        }
        gameMode = 'single';
        isCoopMode = false;
        isVersusMode = false;
        controlsHelpIsCoop = false;
        controlsHelpOpen = true;
        gameState = 'playing';
        startAmbientLoop();
        lastTime = performance.now();
        resetGame({});
        e.preventDefault();
      }
      return;
    }

    if (gameState === 'playing' && controlsHelpOpen) {
      if (e.code === 'Enter' || e.code === 'Space') {
        controlsHelpOpen = false;
        lastTime = performance.now();
        e.preventDefault();
      }
      return;
    }

    if (gameState === 'paused') {
      if (e.code === 'Escape') {
        gameState = 'playing';
        lastTime = performance.now();
      }
      e.preventDefault();
      return;
    }

    if (gameState === 'settlement') {
      e.preventDefault();
      return;
    }

    if (
      gameState === 'playing' &&
      isVersusMode &&
      versusPhase === 'match_end' &&
      (e.code === 'Enter' || e.code === 'KeyJ')
    ) {
      e.preventDefault();
      isVersusMode = false;
      versusPhase = 'fighting';
      gameState = 'menu';
      menuCoopSubOpen = false;
      menuSelectedIndex = 1;
      Object.keys(keys).forEach((k) => {
        keys[k] = false;
      });
      godSkillKeyHeld = false;
      godSkillKeyHeldP2 = false;
      godSkillPressingPointers.clear();
      godPointerIdsP1.clear();
      godPointerIdsP2.clear();
      BGM.cutGameplayMusicNow();
      return;
    }

    // 隐藏快捷键：跳到第三关第四波（最后一关最后一波）
    if (!isVersusMode && !isCoopMode && gameState === 'playing' && player.state === 'alive' && e.code === 'KeyB') {
      e.preventDefault();
      jumpToLevel3FinalWaveHidden();
      return;
    }

    /** 按 M / Q：瞬间成为流浪剑客（满阶含雷神）；仅首次升到该位阶时回满血 */
    if (
      gameState === 'playing' &&
      player.state === 'alive' &&
      !isVersusMode &&
      !isCoopMode &&
      (e.code === 'KeyM' || e.code === 'KeyQ')
    ) {
      e.preventDefault();
      const already =
        berserkerMode && angelMode && demonMode && thorMode && roninMode && gunnerMode && martialMode;
      berserkerMode = true;
      angelMode = true;
      demonMode = true;
      thorMode = true;
      roninMode = true;
      gunnerMode = true;
      martialMode = true;
      if (!already) syncPlayerHpCapAndFill();
      return;
    }

    if (!isVersusMode && gameState === 'playing' && player.state === 'alive' && e.code === 'KeyF') {
      e.preventDefault();
      if (healChargesRemaining > 0) {
        healChargesRemaining -= 1;
        player.hp = player.maxHp;
      }
      return;
    }
    if (!isVersusMode && isCoopMode && gameState === 'playing' && player2.state === 'alive' && e.code === 'KeyV') {
      e.preventDefault();
      if (healChargesRemainingP2 > 0) {
        healChargesRemainingP2 -= 1;
        player2.hp = player2.maxHp;
      }
      return;
    }

    if (gameState === 'playing' && player.state === 'alive' && e.code === 'KeyG') {
      e.preventDefault();
      godSkillKeyHeld = true;
      if (!e.repeat) {
        prepGunnerCombatAudio();
        toggleGodSkill(player);
      }
      return;
    }
    if (isCoopMode && gameState === 'playing' && player2.state === 'alive' && e.code === 'KeyC') {
      e.preventDefault();
      godSkillKeyHeldP2 = true;
      if (!e.repeat) toggleGodSkill(player2);
      return;
    }

    if (e.code === 'Escape') {
      gameState = 'paused';
      Object.keys(keys).forEach((k) => { keys[k] = false; });
      for (const code of hudPointerKeyHold.values()) keys[code] = false;
      hudPointerKeyHold.clear();
      godSkillKeyHeld = false;
      godSkillKeyHeldP2 = false;
      godSkillPressingPointers.clear();
      godPointerIdsP1.clear();
      godPointerIdsP2.clear();
      e.preventDefault();
      return;
    }

    // 结算面板打开、或玩家已死亡时，不要再触发 BGM.start（避免异步重复加载）
    const settlementUiOpen =
      settlementOverlay && !settlementOverlay.classList.contains('hidden');
    if (
      (player.state === 'alive' || (isCoopMode && player2.state === 'alive')) &&
      !settlementUiOpen
    ) {
      startAmbientLoop();
    }
    if (
      gameState === 'playing' &&
      (e.code === 'KeyH' || e.code === 'KeyP')
    ) {
      DEBUG_HITBOX = !DEBUG_HITBOX;
      e.preventDefault();
      return;
    }
    keys[e.code] = true;
    // 左 Shift：P1 冲刺；右 Shift：双人模式下仅 P2（避免同键冲突）
    if (
      e.code === 'ShiftLeft' &&
      player.state === 'alive' &&
      player.dodgeCooldown <= 0 &&
      !player.isDodging &&
      !player.isBlocking
    ) {
      player.dodgeTriggerCount = 1;
    }
    if (
      isCoopMode &&
      e.code === 'ShiftRight' &&
      player2.state === 'alive' &&
      player2.dodgeCooldown <= 0 &&
      !player2.isDodging &&
      !player2.isBlocking
    ) {
      player2.dodgeTriggerCount = 1;
    }
    if (['KeyA', 'KeyD', 'KeyW', 'Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyG') godSkillKeyHeld = false;
    if (e.code === 'KeyC') godSkillKeyHeldP2 = false;
    if (gameState !== 'playing') return;
    keys[e.code] = false;
  });

  const hudPointerKeyHold = new Map();
  function canvasToGameHud(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return { x: 0, y: 0 };
    return {
      x: ((clientX - r.left) / r.width) * config.width,
      y: ((clientY - r.top) / r.height) * config.height,
    };
  }
  function hudRectHit(px, py, rect) {
    return px >= rect.x && py >= rect.y && px <= rect.x + rect.w && py <= rect.y + rect.h;
  }
  canvas.addEventListener('pointermove', (e) => {
    if (gameState !== 'playing' || !gunnerMode) return;
    const { x, y } = canvasToGameHud(e.clientX, e.clientY);
    updateGunnerAimFromPointer(x, y);
  }, { passive: true });
  canvas.addEventListener('pointerdown', (e) => {
    if (gameState !== 'playing') return;
    if (!(player.state === 'alive' || (isCoopMode && player2.state === 'alive'))) return;
    resumeGameAudio();
    const settlementUiOpen =
      settlementOverlay && !settlementOverlay.classList.contains('hidden');
    if (!ambientStarted && !settlementUiOpen) startAmbientLoop();
    const { x, y } = canvasToGameHud(e.clientX, e.clientY);
    const t = performance.now() / 1000;
    if (tryFireGunnerOnPointerDown(e, x, y, t)) return;
    if (useExternalTouchHud) return;
    const R = getGameplayHudRects();
    if (!isVersusMode && hudRectHit(x, y, R.god)) {
      e.preventDefault();
      godSkillPressingPointers.add(e.pointerId);
      toggleGodSkill(player);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) { /* ignore */ }
      return;
    }
    if (hudRectHit(x, y, R.dodge)) {
      e.preventDefault();
      if (
        player.dodgeCooldown <= 0 &&
        !player.isDodging &&
        !player.isBlocking
      ) {
        player.dodgeTriggerCount = Math.min(12, (player.dodgeTriggerCount || 0) + 1);
      }
      return;
    }
    const bind = (rect, code) => {
      if (hudRectHit(x, y, rect)) {
        e.preventDefault();
        keys[code] = true;
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (_) { /* ignore */ }
        hudPointerKeyHold.set(e.pointerId, code);
        return true;
      }
      return false;
    };
    if (bind(R.j, 'KeyJ')) return;
    if (bind(R.l, 'KeyL')) return;
    if (bind(R.k, 'KeyK')) return;
  }, { passive: false });
  function hudPointerUp(e) {
    godSkillPressingPointers.delete(e.pointerId);
    godPointerIdsP1.delete(e.pointerId);
    godPointerIdsP2.delete(e.pointerId);
    const code = hudPointerKeyHold.get(e.pointerId);
    if (code) {
      keys[code] = false;
      hudPointerKeyHold.delete(e.pointerId);
    }
  }
  canvas.addEventListener('pointerup', hudPointerUp);
  canvas.addEventListener('pointercancel', hudPointerUp);
  window.addEventListener('pointerup', hudPointerUp);
  window.addEventListener('pointercancel', hudPointerUp);

  function initExternalTouchRails() {
    if (!useExternalTouchHud) return;
    const bindHold = (btn, keyCode, aliveCheck) => {
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        if (gameState !== 'playing' || !aliveCheck()) return;
        e.preventDefault();
        keys[keyCode] = true;
        try {
          btn.setPointerCapture(e.pointerId);
        } catch (_) { /* ignore */ }
        hudPointerKeyHold.set(e.pointerId, keyCode);
      }, { passive: false });
    };
    const godP1 = document.getElementById('touch-god-p1');
    const godP2 = document.getElementById('touch-god-p2');
    const bindGod = (btn, side) => {
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        if (gameState !== 'playing') return;
        if (!(player.state === 'alive' || (isCoopMode && player2.state === 'alive'))) return;
        e.preventDefault();
        godSkillPressingPointers.add(e.pointerId);
        if (side === 'p1') godPointerIdsP1.add(e.pointerId);
        else godPointerIdsP2.add(e.pointerId);
        toggleGodSkill(side === 'p1' ? player : player2);
        try {
          btn.setPointerCapture(e.pointerId);
        } catch (_) { /* ignore */ }
      }, { passive: false });
    };
    bindGod(godP1, 'p1');
    bindGod(godP2, 'p2');
    const dodgeP1 = document.getElementById('touch-dodge-p1');
    if (dodgeP1) {
      dodgeP1.addEventListener('pointerdown', (e) => {
        if (gameState !== 'playing' || player.state !== 'alive') return;
        e.preventDefault();
        if (player.dodgeCooldown <= 0 && !player.isDodging && !player.isBlocking) {
          player.dodgeTriggerCount = Math.min(12, (player.dodgeTriggerCount || 0) + 1);
        }
      }, { passive: false });
    }
    const dodgeP2 = document.getElementById('touch-dodge-p2');
    if (dodgeP2) {
      dodgeP2.addEventListener('pointerdown', (e) => {
        if (gameState !== 'playing' || !isCoopMode || player2.state !== 'alive') return;
        e.preventDefault();
        if (player2.dodgeCooldown <= 0 && !player2.isDodging && !player2.isBlocking) {
          player2.dodgeTriggerCount = Math.min(12, (player2.dodgeTriggerCount || 0) + 1);
        }
      }, { passive: false });
    }
    bindHold(document.getElementById('touch-j-p1'), 'KeyJ', () => player.state === 'alive');
    bindHold(document.getElementById('touch-l-p1'), 'KeyL', () => player.state === 'alive');
    bindHold(document.getElementById('touch-k-p1'), 'KeyK', () => player.state === 'alive');
    bindHold(document.getElementById('touch-b-p2'), 'KeyB', () => isCoopMode && player2.state === 'alive');
    bindHold(document.getElementById('touch-m-p2'), 'KeyM', () => isCoopMode && player2.state === 'alive');
    bindHold(document.getElementById('touch-n-p2'), 'KeyN', () => isCoopMode && player2.state === 'alive');
  }
  initExternalTouchRails();

  // 某些浏览器会拦截自动播放：首次点击时补一次启动
  window.addEventListener('pointerdown', () => {
    resumeGameAudio();
    const settlementUiOpen =
      settlementOverlay && !settlementOverlay.classList.contains('hidden');
    if (
      gameState === 'playing' &&
      !ambientStarted &&
      (player.state === 'alive' || (isCoopMode && player2.state === 'alive')) &&
      !settlementUiOpen
    ) {
      startAmbientLoop();
    }
  });

  // ========== 工具函数 ==========
  function boxesOverlap(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function canEnemyDamagePlayerNow(sourceEnemy, damageType) {
    if (damageType === 'projectile' || damageType === 'aoe') return true;
    if (!sourceEnemy) return true;
    if (sourceEnemy.isBoss) {
      return (
        sourceEnemy.state === 'attack' ||
        sourceEnemy.state === 'attackWindup' ||
        sourceEnemy.state === 'attackCombo'
      );
    }
    return (
      sourceEnemy.state === 'attack' ||
      sourceEnemy.state === 'attackWindup' ||
      sourceEnemy.state === 'attackCombo'
    );
  }

  function resolveEnemyOverlap() {
    const minGap = 6;
    for (let i = 0; i < enemies.length; i++) {
      const a = enemies[i];
      if (!a || a.hp <= 0) continue;
      for (let j = i + 1; j < enemies.length; j++) {
        const b = enemies[j];
        if (!b || b.hp <= 0) continue;
        const verticalOverlap = !(a.y + a.height <= b.y || b.y + b.height <= a.y);
        if (!verticalOverlap) continue;
        const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        if (overlapX <= 0) continue;
        const push = (overlapX + minGap) * 0.5;
        if (a.x <= b.x) {
          a.x -= push;
          b.x += push;
        } else {
          a.x += push;
          b.x -= push;
        }
        a.x = Math.max(0, Math.min(config.width - a.width, a.x));
        b.x = Math.max(0, Math.min(config.width - b.width, b.x));
      }
    }
  }

  function resolvePlayerEnemyOverlap() {
    const minGap = 4;
    const resolveOne = (actor) => {
      const pLeft = actor.x;
      const pRight = actor.x + config.playerWidth;
      const pTop = actor.y;
      const pBottom = actor.y + config.playerHeight;
      for (const e of enemies) {
        if (!e || e.hp <= 0) continue;
        const verticalOverlap = !(pBottom <= e.y || e.y + e.height <= pTop);
        if (!verticalOverlap) continue;
        const overlapX = Math.min(pRight, e.x + e.width) - Math.max(pLeft, e.x);
        if (overlapX <= 0) continue;
        const push = overlapX + minGap;
        const enemyCenter = e.x + e.width / 2;
        const playerCenter = actor.x + config.playerWidth / 2;
        if (enemyCenter >= playerCenter) {
          e.x += push;
        } else {
          e.x -= push;
        }
        e.x = Math.max(0, Math.min(config.width - e.width, e.x));
      }
    };
    if (player.state === 'alive') resolveOne(player);
    if (isCoopMode && player2.state === 'alive') resolveOne(player2);
  }

  function spawnPerfectBlockParticles(forPl = player) {
    const pl = forPl || player;
    const shieldX = pl.facing === 1
      ? pl.x + config.playerWidth + 8
      : pl.x - 8;
    const shieldY = pl.y + config.playerHeight / 2;
    const shieldRadius = 38;

    for (let i = 0; i < 30; i++) {
      const angle = (pl.facing === 1)
        ? -Math.PI / 2 + Math.random() * Math.PI
        : Math.PI / 2 + Math.random() * Math.PI;

      const spawnX = shieldX + Math.cos(angle) * shieldRadius;
      const spawnY = shieldY + Math.sin(angle) * shieldRadius;

      const speed = 80 + Math.random() * 200;
      const spread = angle + (Math.random() - 0.5) * 0.8;

      perfectBlockParticles.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(spread) * speed * pl.facing,
        vy: Math.sin(spread) * speed - 30 - Math.random() * 60,
        size: 1.5 + Math.random() * 3.5,
        life: 0.4 + Math.random() * 0.6,
        maxLife: 0,
        type: Math.random() < 0.3 ? 'spark' : 'dot',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 10,
        r: 220 + Math.floor(Math.random() * 35),
        g: 160 + Math.floor(Math.random() * 60),
        b: 20 + Math.floor(Math.random() * 40),
        trail: [],
      });
      // 把 maxLife 设为 life 的初始值
      perfectBlockParticles[perfectBlockParticles.length - 1].maxLife =
        perfectBlockParticles[perfectBlockParticles.length - 1].life;
    }
  }

  /** 松手后极短时间内仍算「刚按过格挡」，用于点按弹反 */
  const PARRY_REFLEX_SEC = 0.04;

  function blockInputActive(pl, t) {
    return (
      pl.isBlocking ||
      t - (pl.blockLastPressTime ?? -1e9) <= PARRY_REFLEX_SEC
    );
  }

  /** 双人友伤/对战：按住格挡键即算格挡（避免攻击后摇把 isBlocking 清掉仍吃满伤） */
  function coopMeleeBlockActive(victim, t) {
    if (victim === player) {
      return !!keys['KeyL'] || blockInputActive(player, t);
    }
    if (victim === player2) {
      return !!keys['KeyM'] || blockInputActive(player2, t);
    }
    return blockInputActive(victim, t);
  }

  function isPerfectParry(pl, t) {
    return t - (pl.blockLastPressTime ?? -1e9) <= PARRY_REFLEX_SEC;
  }

  function recordParryRiposteOnAttacker(attacker) {
    stats.hitCount += 1;
    stats.currentCombo = 0;
    attacker.combo = 0;
  }

  function applyDamageToPlayer(amount, t, sourceEnemy, damageType) {
    if (player.state !== 'alive') return false;
    if (player.isDodging) return false;
    if (!canEnemyDamagePlayerNow(sourceEnemy, damageType)) return false;

    let dmg = amount;
    if (damageType === 'projectile' && sourceEnemy && sourceEnemy.type === 'ranged') {
      dmg *= 2;
    }

    if (blockInputActive(player, t)) {
      const shieldCx = player.facing === 1 ? player.x + config.playerWidth + 5 : player.x - 5;
      const shieldCy = player.y + config.playerHeight / 2;
      const perfect = isPerfectParry(player, t);
      if (perfect) {
        player.blockFlashTimer = 0.08;
        player.blockFlashColor = '#facc15';
        player.blockShakeTimer = 0.1;
        player.shieldGoldTimer = 0.3;
        perfectBlockFlashRemain = 0.08;
        player.shieldPulseActive = true;
        player.shieldPulseAge = 0;
        if (sourceEnemy) {
          const dirAway = Math.sign((sourceEnemy.x + sourceEnemy.width / 2) - (player.x + config.playerWidth / 2)) || 1;
          sourceEnemy.vx += dirAway * 620;
          sourceEnemy.vy = -180;
          sourceEnemy.knockbackEnd = Math.max(sourceEnemy.knockbackEnd || 0, t + 0.35);
          const parryLoss = Math.max(
            1,
            Math.round(sourceEnemy.maxHp * (config.perfectParryAttackerHpRatio ?? 0.25))
          );
          sourceEnemy.hp = Math.max(0, sourceEnemy.hp - parryLoss);
        }
        spawnPerfectBlockParticles(player);
        const n = 10 + Math.floor(Math.random() * 6);
        for (let i = 0; i < n; i++) {
          shieldSparks.push({
            x: shieldCx,
            y: shieldCy,
            vx: (Math.random() - 0.5) * 260,
            vy: (Math.random() - 0.5) * 260,
            life: 0.28,
            maxLife: 0.28,
            color: '255, 210, 80',
          });
        }
        playPerfectBlockSound();
        screenShake(150);
        doHitstop();
        hitstopRemain = Math.max(hitstopRemain, 0.05);
        return false;
      }
      // 普通格挡：完全防御所有伤害
      dmg = 0;
      playBlockSound();
      screenShake(60);
      player.blockFlashTimer = 0.08;
      player.blockFlashColor = '#e2e8f0';
      player.blockShakeTimer = 0.1;
      const n = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        shieldSparks.push({
          x: shieldCx,
          y: shieldCy,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.5) * 180,
          life: 0.22,
          maxLife: 0.22,
          color: '220, 240, 255',
        });
      }
      return false;
    }

    // 狂战士 / 天使：站在地上且按住左右移动时，只吃子弹伤害（远程兵子弹已翻倍）；站立不动时正常吃所有伤害
    if (
      (berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) &&
      player.onGround &&
      (keys['KeyA'] || keys['KeyD']) &&
      damageType !== 'projectile'
    ) {
      return false;
    }

    if (dmg <= 0) return false;
    player.hp = Math.max(0, player.hp - dmg);
    recordPlayerHit();
    return true;
  }

  function applyDamageToPlayer2(amount, t, sourceEnemy, damageType) {
    if (!isCoopMode) return false;
    if (player2.state !== 'alive') return false;
    if (player2.isDodging) return false;
    if (!canEnemyDamagePlayerNow(sourceEnemy, damageType)) return false;
    let dmg = amount;
    if (damageType === 'projectile' && sourceEnemy && sourceEnemy.type === 'ranged') {
      dmg *= 2;
    }

    if (blockInputActive(player2, t)) {
      const shieldCx = player2.facing === 1 ? player2.x + config.playerWidth + 5 : player2.x - 5;
      const shieldCy = player2.y + config.playerHeight / 2;
      const perfect = isPerfectParry(player2, t);
      if (perfect) {
        player2.blockFlashTimer = 0.08;
        player2.blockFlashColor = '#facc15';
        player2.blockShakeTimer = 0.1;
        player2.shieldGoldTimer = 0.3;
        perfectBlockFlashRemain = 0.08;
        player2.shieldPulseActive = true;
        player2.shieldPulseAge = 0;
        if (sourceEnemy) {
          const dirAway = Math.sign((sourceEnemy.x + sourceEnemy.width / 2) - (player2.x + config.playerWidth / 2)) || 1;
          sourceEnemy.vx += dirAway * 620;
          sourceEnemy.vy = -180;
          sourceEnemy.knockbackEnd = Math.max(sourceEnemy.knockbackEnd || 0, t + 0.35);
          const parryLossP2 = Math.max(
            1,
            Math.round(sourceEnemy.maxHp * (config.perfectParryAttackerHpRatio ?? 0.25))
          );
          sourceEnemy.hp = Math.max(0, sourceEnemy.hp - parryLossP2);
        }
        spawnPerfectBlockParticles(player2);
        playPerfectBlockSound();
        doHitstop();
        hitstopRemain = Math.max(hitstopRemain, 0.05);
        return false;
      }
      dmg = 0;
      playBlockSound();
      screenShake(60);
      player2.blockFlashTimer = 0.08;
      player2.blockFlashColor = '#e2e8f0';
      player2.blockShakeTimer = 0.1;
      const n = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        shieldSparksP2.push({
          x: shieldCx,
          y: shieldCy,
          vx: (Math.random() - 0.5) * 180,
          vy: (Math.random() - 0.5) * 180,
          life: 0.22,
          maxLife: 0.22,
          color: '220, 240, 255',
        });
      }
      return false;
    }

    if (
      (berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) &&
      player2.onGround &&
      (keys['ArrowLeft'] || keys['ArrowRight']) &&
      damageType !== 'projectile'
    ) {
      return false;
    }

    if (dmg <= 0) return false;
    player2.hp = Math.max(0, player2.hp - dmg);
    return true;
  }

  function recordCoopFriendlyVictimHit(victim) {
    stats.hitCount += 1;
    stats.currentCombo = 0;
    if (victim === player) {
      player.combo = 0;
    } else {
      player2.combo = 0;
    }
  }

  /** Versus 1v1 击退相对基础值的倍率 */
  const VERSUS_KNOCKBACK_MUL = 2;

  /** 玩家受击击退（与怪物 knockbackEnd 阶段一致；Versus / 友军伤害共用） */
  function applyPlayerKnockback(victim, attacker, kbX, kbY, t, fullPower) {
    const knockDir =
      Math.sign(
        victim.x +
          config.playerWidth / 2 -
          (attacker.x + config.playerWidth / 2)
      ) ||
      attacker.facing ||
      1;
    const vsMul = fullPower ? VERSUS_KNOCKBACK_MUL : 1;
    const pkx = fullPower ? kbX * vsMul : Math.min(320, kbX * 0.45);
    const pky = fullPower ? kbY * vsMul : Math.min(-90, kbY * 0.35);
    victim.vx = Math.max(
      -config.maxKnockbackVx,
      Math.min(config.maxKnockbackVx, knockDir * pkx)
    );
    victim.vy = pky;
    victim.knockbackEnd = t + (config.hitstun || 0.12);
  }

  /** 击退窗口内：重力 + 位移 + 地面摩擦（避免 update 开头 vx=0 抹掉击退） */
  function tickPlayerKnockback(pl, dt, t) {
    if (!(pl.knockbackEnd > 0 && t < pl.knockbackEnd)) return false;
    pl.vy += config.gravity * dt;
    pl.x += pl.vx * dt;
    pl.y += pl.vy * dt;
    const groundY = config.groundY - config.playerHeight;
    if (pl.y >= groundY) {
      pl.y = groundY;
      pl.vy = 0;
      pl.onGround = true;
    } else {
      pl.onGround = false;
    }
    pl.vx *= 0.92;
    pl.x = Math.max(0, Math.min(config.width - config.playerWidth, pl.x));
    return true;
  }

  /**
   * 友军近战伤害：普通格挡 Versus 下防守方扣血；完美弹反攻击方按上限比例扣血、防守方不掉血；点按 0.04s 内为完美格挡。
   * @returns {'hit'|'blocked'|'parry'|'dodge'|'immune'}
   */
  function applyCoopFriendlyMeleeDamage(victim, attacker, rawDmg, t, kbX, kbY) {
    if ((!coopFriendlyFireEnabled && !isVersusMode) || !isCoopMode) return 'immune';
    if (!victim || !attacker || victim.state !== 'alive') return 'immune';
    if (victim.isDodging) return 'dodge';

    const movingGroundImmune =
      (berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) &&
      victim.onGround &&
      damageTypeNonProjectileSkip(victim);
    if (movingGroundImmune) return 'immune';

    let dmg = rawDmg;
    if (coopMeleeBlockActive(victim, t)) {
      const shieldCx = victim.facing === 1 ? victim.x + config.playerWidth + 5 : victim.x - 5;
      const shieldCy = victim.y + config.playerHeight / 2;
      const perfect = isPerfectParry(victim, t);
      if (perfect) {
        victim.blockFlashTimer = 0.08;
        victim.blockFlashColor = '#facc15';
        victim.blockShakeTimer = 0.1;
        victim.shieldGoldTimer = 0.3;
        perfectBlockFlashRemain = 0.08;
        victim.shieldPulseActive = true;
        victim.shieldPulseAge = 0;
        spawnPerfectBlockParticles(victim);
        playPerfectBlockSound();
        screenShake(120);
        doHitstop();
        hitstopRemain = Math.max(hitstopRemain, 0.05);
        if (attacker.state === 'alive') {
          const rip = Math.max(
            1,
            Math.round(attacker.maxHp * (config.perfectParryAttackerHpRatio ?? 0.25))
          );
          attacker.hp = Math.max(0, attacker.hp - rip);
          recordParryRiposteOnAttacker(attacker);
          const rdx =
            Math.sign(
              (victim.x + config.playerWidth / 2) -
                (attacker.x + config.playerWidth / 2)
            ) || 1;
          const parryKbMul = isVersusMode ? VERSUS_KNOCKBACK_MUL : 1;
          const rkx = Math.min(config.maxKnockbackVx, kbX * 0.62 * parryKbMul);
          const rky = Math.min(-110, kbY * 0.42 * parryKbMul);
          attacker.vx = Math.max(
            -config.maxKnockbackVx,
            Math.min(config.maxKnockbackVx, rdx * rkx)
          );
          attacker.vy = rky;
          attacker.knockbackEnd = t + (config.hitstun || 0.12);
          const acx = attacker.x + config.playerWidth / 2;
          const acy = attacker.y + config.playerHeight / 2;
          hitFlashEffects.push({ x: acx, y: acy, startTime: t, duration: 0.08 });
          for (let i = 0; i < 7; i++) {
            hitParticles.push({
              x: acx,
              y: acy,
              vx: (Math.random() - 0.5) * 220,
              vy: -85 - Math.random() * 95,
              life: 0.28,
              maxLife: 0.28,
            });
          }
          playHitSound();
        }
        return 'parry';
      }
      dmg = 0;
      playBlockSound();
      screenShake(50);
      victim.blockFlashTimer = 0.08;
      victim.blockFlashColor = '#e2e8f0';
      victim.blockShakeTimer = 0.1;
      return 'blocked';
    }

    if (dmg <= 0) return 'blocked';
    victim.hp = Math.max(0, victim.hp - dmg);
    recordCoopFriendlyVictimHit(victim);
    applyPlayerKnockback(victim, attacker, kbX, kbY, t, isVersusMode);
    const cx = victim.x + config.playerWidth / 2;
    const cy = victim.y + config.playerHeight / 2;
    hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.08 });
    return 'hit';
  }

  function damageTypeNonProjectileSkip(victim) {
    if (victim === player) return !!(keys['KeyA'] || keys['KeyD']);
    return !!(keys['ArrowLeft'] || keys['ArrowRight']);
  }

  // 玩家受击箱（HEART BOX）——和人物宽高完全一致，正好卡在身体里
  function getPlayerHitbox() {
    const inset = config.playerHitboxInsetX ?? 0;
    return {
      left: player.x + inset,
      right: player.x + config.playerWidth - inset,
      top: player.y,
      bottom: player.y + config.playerHeight,
    };
  }

  function getPlayer2Hitbox() {
    return {
      left: player2.x,
      right: player2.x + config.playerWidth,
      top: player2.y,
      bottom: player2.y + config.playerHeight,
    };
  }

  function getLivingPlayers() {
    const out = [];
    if (player.state === 'alive') out.push(player);
    if (isCoopMode && player2.state === 'alive') out.push(player2);
    return out;
  }

  function pickEnemyTargetPlayer(enemy) {
    const ps = getLivingPlayers();
    if (!ps.length) return player;
    const ex = enemy.x + enemy.width / 2;
    let best = ps[0];
    let bestD = Math.abs((best.x + config.playerWidth / 2) - ex);
    for (let i = 1; i < ps.length; i++) {
      const p = ps[i];
      const d = Math.abs((p.x + config.playerWidth / 2) - ex);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }

  /**
   * 双人、两人受击箱重叠且同一攻击同时盖住两人时：只对「更靠近伤害来源一侧」的那名玩家结算一次，
   * 其格挡/无敌与单人一致；另一名不再吃同一段重复伤害（P1/P2 完全对称）。
   */
  function coopFrontPlayerKeyForHit(sourceEnemy, aBox) {
    const p1cx = player.x + config.playerWidth / 2;
    const p2cx = player2.x + config.playerWidth / 2;
    let srcX;
    if (sourceEnemy && sourceEnemy.x !== undefined) {
      srcX = sourceEnemy.x + (sourceEnemy.width ?? config.playerWidth) / 2;
    } else if (aBox) {
      srcX = (aBox.left + aBox.right) / 2;
    } else {
      return 'p1';
    }
    const d1 = Math.abs(p1cx - srcX);
    const d2 = Math.abs(p2cx - srcX);
    if (d1 < d2) return 'p1';
    if (d2 < d1) return 'p2';
    return p1cx <= p2cx ? 'p1' : 'p2';
  }

  function tryDamagePlayersByBox(aBox, amount, t, sourceEnemy, damageType) {
    let touched = false;
    const p1Ok = player.state === 'alive' && boxesOverlap(aBox, getPlayerHitbox());
    const p2Ok = isCoopMode && player2.state === 'alive' && boxesOverlap(aBox, getPlayer2Hitbox());

    if (
      isCoopMode &&
      p1Ok &&
      p2Ok &&
      boxesOverlap(getPlayerHitbox(), getPlayer2Hitbox())
    ) {
      touched = true;
      const who = coopFrontPlayerKeyForHit(sourceEnemy, aBox);
      if (who === 'p1') applyDamageToPlayer(amount, t, sourceEnemy, damageType);
      else applyDamageToPlayer2(amount, t, sourceEnemy, damageType);
      return touched;
    }

    if (p1Ok) {
      touched = true;
      applyDamageToPlayer(amount, t, sourceEnemy, damageType);
    }
    if (p2Ok) {
      touched = true;
      applyDamageToPlayer2(amount, t, sourceEnemy, damageType);
    }
    return touched;
  }

  // ========== 敌人受击箱（最终完美重叠版）==========
  function getEnemyHitbox(enemy) {
    const inset = 5;   // 5让红框几乎和粉色身体完全重叠
    return {
        left: enemy.x + inset,
        right: enemy.x + enemy.width - inset,
        top: enemy.y + 8,
        bottom: enemy.y + enemy.height - 10,
    };
  }

  /** 冥焰枪客专用：在全身受击箱内切分头 / 身（仅子弹判定使用） */
  function getEnemyGunnerHeadBodySplit(enemy) {
    const full = getEnemyHitbox(enemy);
    const totalH = full.bottom - full.top;
    const headRatio = enemy.isBoss ? 0.22 : 0.3;
    const headH = Math.max(10, Math.min(totalH * headRatio, totalH - 12));
    const splitY = full.top + headH;
    return {
      head: {
        left: full.left,
        right: full.right,
        top: full.top,
        bottom: splitY,
      },
      body: {
        left: full.left,
        right: full.right,
        top: splitY,
        bottom: full.bottom,
      },
    };
  }

  function getEnemyHeadHitbox(enemy) {
    return getEnemyGunnerHeadBodySplit(enemy).head;
  }

  function getEnemyBodyHitbox(enemy) {
    return getEnemyGunnerHeadBodySplit(enemy).body;
  }

  /** 子弹 vs 敌人：枪客模式下优先判定头部 */
  function getGunnerBulletHitZone(bBox, enemy) {
    const { head, body } = getEnemyGunnerHeadBodySplit(enemy);
    if (boxesOverlap(bBox, head)) return 'head';
    if (boxesOverlap(bBox, body)) return 'body';
    return null;
  }

  // 玩家攻击判定（HIT BOX）——始终紧贴 HEART BOX 左/右侧
  function getPlayerAttackBox() {
    // 一键修复：普通拳范围约 100，超级拳约 130（留出躲避空间）
    const w = player.isSuperAttacking ? 130 : 100;
    const ox = config.attackOffsetX || 0;
    // 以玩家受击箱为基础，攻击判定永远贴在受击箱外侧
    const hb = getPlayerHitbox();
    let left, right;
    if (player.facing === 1) {
      // 面向右：HIT BOX 在 HEART BOX 右侧
      left = hb.right + ox;
      right = left + w;
    } else {
      // 面向左：HIT BOX 在 HEART BOX 左侧
      right = hb.left - ox;
      left = right - w;
    }
    return {
      left,
      right,
      top: hb.top,
      bottom: hb.bottom,
    };
  }

  // ========== AI 行为模板（状态机：idle -> chase -> attack -> recover -> chase） ==========
  const AIBehaviors = {
    // 类型 A：近战压迫型 — 靠近玩家，进入范围则攻击，受击由外部击退处理
    A(enemy, dt, t) {
      const centerX = enemy.x + enemy.width / 2;
      const target = pickEnemyTargetPlayer(enemy);
      const playerCenterX = target.x + config.playerWidth / 2;
      const dist = Math.abs(playerCenterX - centerX);
      const dir = Math.sign(playerCenterX - centerX) || 1;
      enemy.facing = dir;

      if (enemy.state === 'idle') {
        enemy.state = 'chase';
        enemy.stateTimer = 0;
      }

      if (enemy.state === 'chase') {
        if (dist <= config.typeAAttackRange && t >= (enemy.nextAttackAllowedAt || 0)) {
          enemy.state = 'attackWindup';
          enemy.stateTimer = 0;
          enemy.attackHitDone = false;
          enemy.attackWarnTimer = 0.3;
        } else if (dist <= config.typeAAttackRange) {
          enemy.vx = 0;
        } else {
          const speedMul = enemyDifficultySpeedMul(enemy);
          enemy.vx = dir * (enemy.aiWalkSpeed ?? config.typeAWalkSpeed) * speedMul;
          enemy.x += enemy.vx * dt;
        }
      } else if (enemy.state === 'attackWindup') {
        enemy.vx = 0;
        enemy.stateTimer += dt;
        if (enemy.stateTimer >= 0.24) {
          enemy.state = 'attack';
          enemy.stateTimer = 0;
          enemy.attackHitDone = false;
        }
      } else if (enemy.state === 'attack') {
        enemy.vx = 0;
        enemy.stateTimer += dt;
        const hitTime = 0.34;
        const attackDuration = 0.72;
        if (!enemy.attackHitDone && enemy.stateTimer >= hitTime && enemy.stateTimer < hitTime + dt * 2) {
          const attackW = 40;
          const inset = 30; // 往右缩一点，防止框跑到身体左外面
          let attackLeft, attackRight;
          if (enemy.facing === 1) {
            // 朝右：从身体右边往右伸
            attackLeft = enemy.x + enemy.width;
            attackRight = attackLeft + attackW;
          } else {
            // 朝左：从身体左边往左伸，但整体向右缩 inset
            attackRight = enemy.x + inset;
            attackLeft = attackRight - attackW;
          }
          const aBox = {
            left: attackLeft,
            right: attackRight,
            top: enemy.y + 10,
            bottom: enemy.y + enemy.height - 10,
          };
          if (tryDamagePlayersByBox(aBox, (enemy.aiAttackDamage ?? config.enemyAttackDamage), t, enemy)) {
            enemy.attackHitDone = true;
          }
        }
        if (enemy.stateTimer >= attackDuration) {
          enemy.state = 'recover';
          enemy.stateTimer = 0;
          enemy.nextAttackAllowedAt = t + 2.0;
        }
      } else if (enemy.state === 'recover') {
        enemy.vx = 0;
        enemy.stateTimer += dt;
        const recoverDuration =
          config.typeARecoverDuration * (enemy.attackCdStrategyMul ?? 1) * (enemy.baseAttackCdMul ?? 1);
        if (enemy.stateTimer >= recoverDuration) {
          enemy.state = 'chase';
          enemy.stateTimer = 0;
        }
      }

      enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
    },

    // 类型 B：远程型 — 保持距离，定期发射，玩家靠近则后退
    B(enemy, dt, t) {
      const centerX = enemy.x + enemy.width / 2;
      const target = pickEnemyTargetPlayer(enemy);
      const playerCenterX = target.x + config.playerWidth / 2;
      const dist = Math.abs(playerCenterX - centerX);
      const dir = Math.sign(playerCenterX - centerX) || 1;
      enemy.facing = dir;

      if (enemy.state === 'idle') {
        enemy.state = 'chase';
        enemy.stateTimer = 0;
      }

      if (enemy.state === 'chase') {
        const keep = enemy.aiKeepDistance ?? config.rangedKeepDistance;
        const speedMul = enemyDifficultySpeedMul(enemy);
        if (dist < keep - 25) {
          enemy.vx = -dir * (enemy.aiWalkSpeed ?? config.rangedWalkSpeed) * speedMul;
        } else if (dist > keep + 25) {
          enemy.vx = dir * (enemy.aiWalkSpeed ?? config.rangedWalkSpeed) * speedMul;
        } else {
          enemy.vx = 0;
        }
        enemy.x += enemy.vx * dt;
        enemy.projectileTimer = (enemy.projectileTimer || 0) - dt;
        if (enemy.projectileTimer <= 0) {
          enemy.projectileTimer =
            config.projectileInterval * (enemy.attackCdStrategyMul ?? 1) * (enemy.baseAttackCdMul ?? 1);
          enemy.state = 'attack';
          enemy.stateTimer = 0;
        }
      } else if (enemy.state === 'attack') {
        enemy.vx = 0;
        const px = enemy.facing === 1 ? enemy.x + enemy.width : enemy.x;
        projectiles.push({
          x: px,
          y: enemy.y + enemy.height / 2,
          vx: enemy.facing * config.projectileSpeed,
          life: 4,
          owner: enemy,
          damage: Math.max(
            1,
            Math.round(
              config.projectileDamage *
                (enemy.difficultyDmgMul ?? 1) *
                (enemy.firstRunHumanDmgMul ?? 1)
            )
          ),
        });
        enemy.state = 'recover';
        enemy.stateTimer = 0;
      } else if (enemy.state === 'recover') {
        enemy.stateTimer += dt;
        const recoverDuration =
          config.typeBRecoverDuration * (enemy.attackCdStrategyMul ?? 1) * (enemy.baseAttackCdMul ?? 1);
        if (enemy.stateTimer >= recoverDuration) {
          enemy.state = 'chase';
          enemy.stateTimer = 0;
        }
      }

      enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
    },

    // 类型 C：冲锋型 — 每隔 3 秒冲刺一次，前摇 0.5 秒
    C(enemy, dt, t) {
      const centerX = enemy.x + enemy.width / 2;
      const target = pickEnemyTargetPlayer(enemy);
      const playerCenterX = target.x + config.playerWidth / 2;
      const dir = Math.sign(playerCenterX - centerX) || 1;
      enemy.facing = dir;

      if (enemy.state === 'idle') {
        enemy.state = 'chase';
        enemy.stateTimer = 0;
        enemy.chargeCooldown = 0;
      }

      if (enemy.state === 'chase') {
        enemy.stateTimer += dt;
        enemy.chargeCooldown = (enemy.chargeCooldown ?? config.typeCChargeInterval) - dt;
        if (enemy.chargeCooldown <= 0) {
          enemy.state = 'windup';
          enemy.stateTimer = 0;
          enemy.chargeCooldown = config.typeCChargeInterval;
        } else {
          const speedMul = enemyDifficultySpeedMul(enemy);
          enemy.vx = dir * (enemy.aiWalkSpeed ?? config.typeCWalkSpeed) * speedMul;
          enemy.x += enemy.vx * dt;
        }
      } else if (enemy.state === 'windup') {
        enemy.vx = 0;
        enemy.stateTimer += dt;
        if (enemy.stateTimer >= config.typeCWindupDuration) {
          enemy.state = 'charge';
          enemy.stateTimer = 0;
          enemy.vx =
            dir * config.typeCChargeSpeed * (enemy.difficultySpdMul ?? 1);
          enemy.attackWarnTimer = 0.3;
          enemy.chargeHitDone = false;
        }
      } else if (enemy.state === 'charge') {
        enemy.x += enemy.vx * dt;
        enemy.stateTimer += dt;
        if (!enemy.chargeHitDone) {
          const aBox = {
            left: enemy.x,
            right: enemy.x + enemy.width,
            top: enemy.y + 8,
            bottom: enemy.y + enemy.height - 8,
          };
          if (tryDamagePlayersByBox(aBox, enemy.aiAttackDamage ?? config.enemyAttackDamage, t, enemy)) {
            enemy.chargeHitDone = true;
          }
        }
        if (enemy.stateTimer >= config.typeCChargeDuration) {
          enemy.vx = 0;
          enemy.state = 'recover';
          enemy.stateTimer = 0;
          enemy.chargeHitDone = false;
        }
      } else if (enemy.state === 'recover') {
        enemy.vx = 0;
        enemy.stateTimer += dt;
        const recoverDuration =
          config.typeCRecoverDuration * (enemy.attackCdStrategyMul ?? 1) * (enemy.baseAttackCdMul ?? 1);
        if (enemy.stateTimer >= recoverDuration) {
          enemy.state = 'chase';
          enemy.stateTimer = 0;
        }
      }

      enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
    },
  };

  // 根据敌人 type 选择 AI 模板（可扩展）
  function getAITemplate(enemy) {
    if (enemy.isBoss) return null;
    const map = { melee: 'A', elite: 'A', Zombie_Axe: 'A', sec: 'A', ranged: 'B', charge: 'C' };
    return map[enemy.type] || null;
  }

  function updateEnemyCounter(enemy, dt, t) {
    enemy.state = 'attack'; // 用现有攻击动画
    enemy.stateTimer = (enemy.stateTimer || 0) + dt;
    enemy.vx = 0;

    const hitTime = 0.15;
    if (!enemy.counterHitDone && enemy.stateTimer >= hitTime) {
      const dir = enemy.facing || 1;
      const attackW = 42;
      let attackLeft;
      let attackRight;
      if (dir >= 0) {
        attackLeft = enemy.x + enemy.width;
        attackRight = attackLeft + attackW;
      } else {
        attackRight = enemy.x;
        attackLeft = attackRight - attackW;
      }
      const aBox = {
        left: attackLeft,
        right: attackRight,
        top: enemy.y + 10,
        bottom: enemy.y + enemy.height - 10,
      };
      const counterDamage = enemy.counterDamage || 10;
      tryDamagePlayersByBox(aBox, counterDamage, t, enemy);
      enemy.counterHitDone = true;
    }

    if (enemy.stateTimer >= config.typeAAttackDuration) {
      enemy.isCountering = false;
      enemy.state = 'recover';
      enemy.stateTimer = 0;
      enemy.counterHitDone = false;
      enemy.counterCooldownEnd = Math.max(enemy.counterCooldownEnd || 0, t + 2.0);
    }
  }

  // ========== 敌人生成 ==========
  function enemyDifficultySpeedMul(enemy) {
    return (
      (enemy.speedStrategyMul ?? 1) *
      (enemy.baseSpeedMul ?? 1) *
      (enemy.difficultySpdMul ?? 1)
    );
  }

  function spawnEnemy(type, x, y) {
    const canBeFast = type !== 'boss';
    const isFastVariant = canBeFast && Math.random() < 0.3; // 30% 概率快速型
    const enemy = {
      id: nextEnemyId++,
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      width: config.enemyWidth,
      height: config.enemyHeight,
      hp: config.enemyMaxHp,
      maxHp: config.enemyMaxHp,
      facing: -1,
      knockbackEnd: 0,
      hurtEnd: 0,
      aiTimer: 0,
      projectileTimer:
        type === 'ranged' ? Math.random() * config.projectileInterval * (isFastVariant ? 0.7 : 1) : 0,
      state: 'idle',
      stateTimer: 0,
      lastHitAttackId: 0,
      isBoss: false,
      bossPhase: 0,
      bossChargeTimer: 0,
      bossAoeTimer: 0,
      color: '#f87171',
      // 互动增强 AI：低血闪避 + 近距反击（在 updateEnemies 叠加，不替换原状态机）
      nextAiRollAt: 0.25 + Math.random() * 0.25,
      evadeUntil: 0,
      evadeDir: 0,
      counterCooldownEnd: 0,
      isCountering: false,
      counterHitDone: false,
      counterDamage: 10,
      nextAttackAllowedAt: 0,
      attackWarnTimer: 0,
      preEvadeCooldownEnd: 0,
      evadeDecisionCooldownEnd: 0,
      lastPredodgeAttackId: 0,
      evadeLandingInvulnPending: false,
      invulnerableUntil: 0,
      hpStrategyTier: 'mid',
      speedStrategyMul: 1,
      attackCdStrategyMul: 1,
      variant: isFastVariant ? 'fast' : 'normal',
      baseSpeedMul: isFastVariant ? 1.5 : 1,
      baseAttackCdMul: isFastVariant ? 0.7 : 1,
    };

    if (type === 'melee') {
      enemy.aiTemplate = 'A';
    } else if (type === 'Zombie_Axe') {
      enemy.hp = config.eliteMaxHp;
      enemy.maxHp = config.eliteMaxHp;
      enemy.color = '#f97316';
      enemy.aiTemplate = 'A';
    } else if (type === 'ranged') {
      enemy.hp = config.rangedMaxHp;
      enemy.maxHp = config.rangedMaxHp;
      enemy.color = '#60a5fa';
      enemy.aiTemplate = 'B';
    } else if (type === 'elite') {
      enemy.hp = config.eliteMaxHp;
      enemy.maxHp = config.eliteMaxHp;
      enemy.color = '#facc15';
      enemy.aiTemplate = 'A';
      enemy.aiWalkSpeed = config.eliteWalkSpeed;
      enemy.aiAttackDamage = 12;
    } else if (type === 'sec') {
      // 新怪物：比精英弱一点，但比 ranged/charge 强
      enemy.width = config.bossWidth;
      enemy.height = config.bossHeight;
      enemy.y = config.groundY - enemy.height;
      enemy.hp = Math.round(config.eliteMaxHp * 0.75);
      enemy.maxHp = Math.round(config.eliteMaxHp * 0.75);
      enemy.color = '#38bdf8';
      enemy.aiTemplate = 'A';
      enemy.aiWalkSpeed = Math.round(config.eliteWalkSpeed * 0.9);
      enemy.aiAttackDamage = 9; // 精英(12)的 3/4
    } else if (type === 'charge') {
      enemy.hp = config.enemyMaxHp;
      enemy.maxHp = config.enemyMaxHp;
      enemy.color = '#a78bfa';
      enemy.aiTemplate = 'C';
    } else if (type === 'boss') {
      enemy.width = config.bossWidth;
      enemy.height = config.bossHeight;
      enemy.hp = config.bossMaxHp;
      enemy.maxHp = config.bossMaxHp;
      enemy.isBoss = true;
      enemy.bossPhase = 1;
      enemy.color = '#fb7185';
      enemy.state = 'walk';
      enemy.attackCooldownRemain = 0.5;
      enemy.chargeCooldownRemain = 1;
      enemy.aoeCooldownRemain = 0;
      enemy.enragedLabelTimer = 0;
      enemy.contactHitCooldownEnd = 0;
    }

    if (isFastVariant && !enemy.isBoss) {
      enemy.maxHp = Math.max(1, Math.round(enemy.maxHp * 0.8));
      enemy.hp = Math.min(enemy.hp, enemy.maxHp);
    }

    const ed = getEnemyDifficultyMultipliers();
    enemy.difficultySpdMul = ed.spd;
    enemy.difficultyDmgMul = ed.dmg;
    enemy.maxHp = Math.max(1, Math.round(enemy.maxHp * ed.hp));
    enemy.hp = enemy.maxHp;
    const baseMeleeDmg = enemy.aiAttackDamage ?? config.enemyAttackDamage;
    enemy.aiAttackDamage = Math.max(1, Math.round(baseMeleeDmg * ed.dmg));
    enemy.counterDamage = Math.max(1, Math.round(enemy.counterDamage * ed.dmg));
    if (enemy.aiWalkSpeed != null) {
      enemy.aiWalkSpeed = Math.max(1, Math.round(enemy.aiWalkSpeed * ed.spd));
    }
    if (enemy.isBoss) {
      enemy.bossMeleeDamage = Math.max(1, Math.round(config.bossAttackDamage * ed.dmg));
      enemy.bossAoeDamageScaled = Math.max(1, Math.round(config.bossAoeDamage * ed.dmg));
      enemy.bossMoveScale = ed.spd;
    }

    /** 尚未获得狂战士前（首通期）：敌人血量 ÷5，攻击力 ÷2 */
    enemy.firstRunHumanHpMul = berserkerMode ? 1 : 0.2;
    enemy.firstRunHumanDmgMul = berserkerMode ? 1 : 0.5;
    enemy.maxHp = Math.max(1, Math.round(enemy.maxHp * enemy.firstRunHumanHpMul));
    enemy.hp = enemy.maxHp;
    enemy.aiAttackDamage = Math.max(1, Math.round(enemy.aiAttackDamage * enemy.firstRunHumanDmgMul));
    enemy.counterDamage = Math.max(1, Math.round(enemy.counterDamage * enemy.firstRunHumanDmgMul));
    if (enemy.isBoss) {
      enemy.bossMeleeDamage = Math.max(1, Math.round(enemy.bossMeleeDamage * enemy.firstRunHumanDmgMul));
      enemy.bossAoeDamageScaled = Math.max(1, Math.round(enemy.bossAoeDamageScaled * enemy.firstRunHumanDmgMul));
    }

    initEnemyAnim(enemy);
    if (type === 'Zombie_Axe' || type === 'sec') {
      enemy.anim = 'idle';
      enemy.frame = 0;
      enemy.frameTimer = 0;
      enemy.frameInterval = 120; // 120ms 每帧
    }
    enemies.push(enemy);
    return enemy;
  }

  // ========== 玩家更新 ==========
  function updatePlayer(dt, t) {
    if (player.state === 'dead') {
      // 死亡后不再响应输入或移动
      player.vx = 0;
      player.vy = 0;
      return;
    }
    if (isVersusMode && versusPhase !== 'fighting') {
      player.vx = 0;
      player.vy = 0;
      return;
    }
    if (tickPlayerKnockback(player, dt, t)) return;

    player.vx = 0;
    if (player.dodgeCooldown > 0) player.dodgeCooldown = Math.max(0, player.dodgeCooldown - dt);
    if (player.blockFlashTimer > 0) player.blockFlashTimer = Math.max(0, player.blockFlashTimer - dt);
    if (player.blockShakeTimer > 0) player.blockShakeTimer = Math.max(0, player.blockShakeTimer - dt);
    if (player.shieldGoldTimer > 0) player.shieldGoldTimer = Math.max(0, player.shieldGoldTimer - dt);
    player.shieldPulseTimer = (player.shieldPulseTimer || 0) + dt;
    if (player.shieldPulseActive) {
      player.shieldPulseAge += dt;
      if (player.shieldPulseAge >= 0.3) {
        player.shieldPulseAge = 0;
        player.shieldPulseActive = false;
      }
    }

    for (let i = dodgeAfterimages.length - 1; i >= 0; i--) {
      const a = dodgeAfterimages[i];
      a.alpha -= dt * 3.2;
      if (a.alpha <= 0) dodgeAfterimages.splice(i, 1);
    }

    for (let i = shieldParticles.length - 1; i >= 0; i--) {
      const p = shieldParticles[i];
      p.theta += p.speed * dt;
      p.life -= dt;
      if (p.life <= 0) shieldParticles.splice(i, 1);
    }
    for (let i = shieldSparks.length - 1; i >= 0; i--) {
      const p = shieldSparks[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt;
      if (p.life <= 0) shieldSparks.splice(i, 1);
    }

    let moveSpd = config.playerSpeed;
    if (player.godThorMoveActive && thorMode) moveSpd *= 2;

    if (keys['KeyA']) {
      player.vx = -moveSpd;
      player.facing = -1;
    }
    if (keys['KeyD']) {
      player.vx = moveSpd;
      player.facing = 1;
    }

    const demonFlying = player.godDemonFlyRemain > 0 && demonMode;
    if (keys['KeyW'] && (player.onGround || demonFlying)) {
      if (demonFlying) {
        player.vy -= 520 * dt;
        player.vy = Math.max(-340, player.vy);
      } else {
        player.vy = config.jumpForce;
        player.onGround = false;
      }
    }
    if (demonFlying && keys['KeyS']) {
      player.vy += 420 * dt;
      player.vy = Math.min(340, player.vy);
    }

    const inAttack =
      player.attackStart > 0 &&
      t - player.attackStart < (player.attackDurationSec || config.attackDuration / 1000);
    const shiftHeld = !!keys['ShiftLeft'];
    const blockHeld = !!keys['KeyL'];

    // ========== 连招窗口（真实时间，不受慢动作 dt 影响） ==========
    const jHeld = !!keys['KeyJ'];
    const jPressed = jHeld && !player.jHeldLast;
    player.jHeldLast = jHeld;

    if (player.comboStep > 0 && player.comboNextDeadline > 0) {
      player.comboTimer = Math.max(0, player.comboNextDeadline - t);
      if (player.comboTimer <= 0) {
        player.comboStep = 0;
        player.comboTimer = 0;
        player.comboActiveStep = 0;
        player.comboNextDeadline = 0;
      }
    } else {
      player.comboTimer = 0;
    }

    if (!player.isDodging && !inAttack && !player.isSuperAttacking) {
      const allowBlock = blockHeld;
      player.isBlocking = allowBlock;
      if (allowBlock && !player.blockHeldLast) {
        player.blockStartTime = t;
        player.blockLastPressTime = t;
      }
    } else {
      player.isBlocking = false;
    }

    // 冲刺：仅响应明确触发；不再按住自动补充，避免“自动闪一下”
    const canStartDash =
      player.state === 'alive' &&
      !inAttack &&
      !player.isSuperAttacking &&
      !player.isBlocking &&
      !player.isDodging &&
      player.dodgeCooldown <= 0;
    player.dodgeHoldRepeat = 0;

    if (player.dodgeTriggerCount > 0 && canStartDash) {
      player.dodgeTriggerCount--;
      let dir = 0;
      if (keys['KeyA']) dir = -1;
      else if (keys['KeyD']) dir = 1;
      else dir = player.facing || 1;
      player.isDodging = true;
      player.dodgeDir = dir;
      player.dodgeTimer = player.dodgeDuration;
      player.dodgeCooldown = player.dodgeCooldownMax;
      player.dodgeTrailTimer = 0;
      player.vy = 0;
      playDodgeSound();
    }

    if (player.isDodging) {
      player.isBlocking = false;
      player.dodgeTimer -= dt;
      player.vx = player.dodgeDir * player.dodgeSpeed;
      player.dodgeTrailTimer -= dt;
      if (player.dodgeTrailTimer <= 0) {
        player.dodgeTrailTimer = 0.04;
        dodgeAfterimages.push({ x: player.x, y: player.y, alpha: 0.42 });
        if (dodgeAfterimages.length > 4) dodgeAfterimages.shift();
      }
      if (player.dodgeTimer <= 0) {
        player.isDodging = false;
        player.dodgeTimer = 0;
      }
    }

    // 格挡时移动降为 30%
    if (player.isBlocking && !player.isDodging) {
      player.vx *= 0.3;
      if (shieldParticles.length < 5 && Math.random() < 0.22) {
        shieldParticles.push({
          theta: (player.facing === 1 ? -Math.PI / 2 : Math.PI / 2) + Math.random() * Math.PI,
          speed: 0.6 + Math.random() * 1.0,
          size: 1.5 + Math.random() * 1.5,
          life: 1.1 + Math.random() * 0.5,
          maxLife: 1.6,
        });
      }
      if (player.shieldPulseTimer >= 0.8) {
        player.shieldPulseTimer = 0;
        player.shieldPulseAge = 0;
        player.shieldPulseActive = true;
      }
    } else {
      shieldParticles.length = Math.min(shieldParticles.length, 8);
    }

    // 普通攻击（J 三段连招）
    if (
      jPressed &&
      !(gunnerMode && !martialMode && player.godRageActive) &&
      !inAttack &&
      t >= player.attackCooldownEnd &&
      !player.isSuperAttacking &&
      !player.isDodging &&
      !player.isBlocking
    ) {
      let step = 1;
      if (player.comboStep === 0 || player.comboTimer <= 0) step = 1;
      else if (player.comboStep === 1) step = 2;
      else if (player.comboStep === 2) step = 3;
      else step = 1; // 第3段按下后如果仍在窗口内，重新开一套

      const combo = comboData[step - 1];
      player.comboStep = step;
      player.comboActiveStep = step;
      player.comboTimer = player.comboWindowMax;
      player.comboNextDeadline = t + combo.duration + player.comboWindowMax;

      player.currentAttackId += 1;
      player.attackStart = t;
      player.attackDurationSec = combo.duration;
      player.attackCooldownEnd = t + combo.cooldown * getPlayerAttackCooldownScale();

      // 连招每段“前冲力度”不同
      const dir = player.facing || 1;
      player.vx += dir * combo.dashForce;

      // 拳风特效（在判定框位置）
      spawnPunchWind(step);
      spawnComboName(step, player);
      spawnBerserkerPunchRedParticles(step);
      spawnRoninSwordQiOnNormalAttack();
      spawnXianglongDragonPalmOnNormalAttack(player);

      if (punchSprite) punchSprite.playOnce();
    }
    // 超级拳（K）——独立冷却，大招期间不允许普通攻击
    if (keys['KeyK'] && player.superAttackCooldown <= 0 && !inAttack && !player.isSuperAttacking && !player.isDodging && !player.isBlocking) {
      player.isSuperAttacking = true;
      // 超级拳不参与 J 连招：启动大招时直接打断连招窗口
      player.comboStep = 0;
      player.comboTimer = 0;
      player.comboActiveStep = 0;
      player.comboNextDeadline = 0;
      player.superAttackTimer = player.superAttackDuration;
      player.superAttackFrame = 0;
      player.superAttackCooldown = player.superAttackCooldownMax;
      playSuperPunchSound();  // 发动音效
      screenShake(200);       // 按 K 时屏幕震动
      spawnBerserkerSuperPunchRedParticles();
      // 也当作一次攻击，复用现有命中窗口逻辑
      player.currentAttackId += 1;
      player.attackStart = t;
      player.attackDurationSec = player.superAttackDuration / 1000;
      player.attackCooldownEnd = t + (config.attackCooldown / 1000) * getPlayerAttackCooldownScale();
    }

    // 枪系统暂时停用（仅保留拳头）
    if (player.attackStart > 0 && t - player.attackStart > (player.attackDurationSec || config.attackDuration / 1000)) {
      player.attackStart = 0;
    }

    // 超级拳计时 & 帧推进（使用毫秒）
    if (player.isSuperAttacking) {
      player.superAttackTimer -= dt * 1000;
      if (player.superAttackTimer <= 0) {
        player.isSuperAttacking = false;
      } else {
        player.superAttackFrame = Math.floor(
          (player.superAttackDuration - player.superAttackTimer) /
          (player.superAttackDuration / 4)
        );
      }
    }

    // 超级拳冷却（毫秒）
    if (player.superAttackCooldown > 0) {
      player.superAttackCooldown -= dt * 1000;
      if (player.superAttackCooldown < 0) player.superAttackCooldown = 0;
    }

    if (demonFlying) {
      player.vy += config.gravity * 0.14 * dt;
      player.x += player.vx * dt;
      player.y += player.vy * dt;
      const topY = 24;
      const groundY = config.groundY - config.playerHeight;
      if (player.y > groundY) {
        player.y = groundY;
        player.vy = Math.min(0, player.vy);
        player.onGround = true;
      } else {
        player.onGround = false;
      }
      if (player.y < topY) {
        player.y = topY;
        player.vy = Math.max(0, player.vy);
      }
    } else {
      player.vy += config.gravity * dt;
      player.x += player.vx * dt;
      player.y += player.vy * dt;

      if (player.y >= config.groundY - config.playerHeight) {
        player.y = config.groundY - config.playerHeight;
        player.vy = 0;
        player.onGround = true;
      }
    }

    player.x = Math.max(0, Math.min(config.width - config.playerWidth, player.x));

    if (player.godDemonFlyRemain > 0 && demonMode && StageController.state !== 'transition') {
      player.godDemonFlyRemain -= dt;
      if (player.godDemonFlyRemain < 0) player.godDemonFlyRemain = 0;
    }

    player.shiftHeldLast = shiftHeld;
    player.blockHeldLast = blockHeld;
  }

  function getPlayer2AttackBox() {
    const w = player2.isSuperAttacking ? 130 : 100;
    const ox = config.attackOffsetX || 0;
    const hb = getPlayer2Hitbox();
    let left, right;
    if (player2.facing === 1) {
      left = hb.right + ox;
      right = left + w;
    } else {
      right = hb.left - ox;
      left = right - w;
    }
    return { left, right, top: hb.top, bottom: hb.bottom };
  }

  function handlePlayer2Attack(t) {
    if (!isCoopMode || player2.state !== 'alive') return;
    if (player2.gunnerShootOnlyAnim) return;
    const attackMid =
      player2.attackStart > 0 &&
      t - player2.attackStart >= 0.06 &&
      t - player2.attackStart <= 0.14;
    if (!attackMid) return;
    const box = getPlayer2AttackBox();
    const attackStep = player2.isSuperAttacking ? 0 : (player2.comboActiveStep || player2.comboStep || 0);
    let anyHit = false;
    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      if (enemy.hurtEnd && t < enemy.hurtEnd) continue;
      if (enemy.invulnerableUntil && t < enemy.invulnerableUntil) continue;
      if (!boxesOverlap(box, getEnemyHitbox(enemy))) continue;
      if (enemy.lastHitAttackIdP2 === player2.currentAttackId) continue;
      enemy.lastHitAttackIdP2 = player2.currentAttackId;
      let dmgBase = getPlayerDamage(player2);
      dmgBase *= getRoninGunnerMeleeMul();
      if (player2.isSuperAttacking) {
        dmgBase *= 3;
      } else if (attackStep >= 1 && attackStep <= 3) {
        dmgBase *= comboData[attackStep - 1].damageMul;
      }
      if (player2.combo >= 3) dmgBase *= 1.5;
      dmgBase = Math.max(1, Math.round(dmgBase));
      const hpBefore = enemy.hp;
      enemy.hp = Math.max(0, enemy.hp - dmgBase);
      enemy.hurtEnd = t + config.hurtCooldown;
      let kbX = player2.isSuperAttacking ? 680 : 380;
      let kbY = player2.isSuperAttacking ? -220 : -160;
      if (!player2.isSuperAttacking && attackStep >= 1 && attackStep <= 3) {
        const combo = comboData[attackStep - 1];
        kbX *= combo.knockbackMul;
        kbY *= combo.knockbackMul;
      }
      enemy.vx += (player2.facing || 1) * kbX;
      enemy.vy = kbY;
      const cx = enemy.x + enemy.width / 2;
      const cy = enemy.y + enemy.height / 2;
      hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.08 });
      if (
        player2.godRageActive &&
        (getCurrentGodSkillTier() === 'berserker' ||
          getCurrentGodSkillTier() === 'ronin')
      ) {
        for (let i = 0; i < 10; i++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 260,
            vy: -120 - Math.random() * 140,
            life: 0.35,
            maxLife: 0.35,
            noGravity: false,
            isRageRed: true,
          });
        }
        for (let i = 0; i < 8; i++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 200,
            vy: -90 - Math.random() * 100,
            life: 0.4,
            maxLife: 0.4,
            isRageGold: true,
          });
        }
      }
      player2.combo += 1;
      if (hpBefore > 0 && enemy.hp <= 0) {
        const anyAlive = enemies.some((e) => e.hp > 0);
        if (anyAlive) addKillImpactScreenShake(enemy);
        else if (!slowMotionTimer) triggerSlowMotion(cx, cy, !!enemy.isBoss);
      }
      anyHit = true;
    }

    if (
      (coopFriendlyFireEnabled || isVersusMode) &&
      isCoopMode &&
      player.state === 'alive' &&
      boxesOverlap(box, getPlayerHitbox()) &&
      player.coopFriendlyLastHitAttackId !== player2.currentAttackId
    ) {
      player.coopFriendlyLastHitAttackId = player2.currentAttackId;
      let ffDmg = getPlayerDamage(player2);
      ffDmg *= getRoninGunnerMeleeMul();
      if (player2.isSuperAttacking) ffDmg *= 3;
      else if (attackStep >= 1 && attackStep <= 3) ffDmg *= comboData[attackStep - 1].damageMul;
      if (player2.combo >= 3) ffDmg *= 1.5;
      ffDmg = Math.max(1, Math.round(ffDmg));
      let kbX = player2.isSuperAttacking ? 680 : 380;
      let kbY = player2.isSuperAttacking ? -220 : -160;
      if (!player2.isSuperAttacking && attackStep >= 1 && attackStep <= 3) {
        const cb = comboData[attackStep - 1];
        kbX *= cb.knockbackMul;
        kbY *= cb.knockbackMul;
      }
      const r = applyCoopFriendlyMeleeDamage(player, player2, ffDmg, t, kbX, kbY);
      if (r === 'hit') {
        const cx = player.x + config.playerWidth / 2;
        const cy = player.y + config.playerHeight / 2;
        for (let i = 0; i < 8; i++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 200,
            vy: -90 - Math.random() * 100,
            life: 0.28,
            maxLife: 0.28,
          });
        }
        doHitstop();
        if (player2.isSuperAttacking) playHitSound();
        else playComboHitSound(attackStep || 1);
        if (isVersusMode && !player2.isSuperAttacking && attackStep === 3) {
          player.vy -= 150 * VERSUS_KNOCKBACK_MUL;
          player.knockbackEnd = Math.max(player.knockbackEnd || 0, t + (config.hitstun || 0.12));
          comboFlashRemain = Math.max(comboFlashRemain, 0.05);
        }
        anyHit = true;
      } else if (r === 'blocked') {
        anyHit = true;
      }
    }

    if (anyHit) {
      const hitStep = player2.isSuperAttacking
        ? 0
        : player2.comboActiveStep || player2.comboStep || 1;
      doHitstop();
      if (player2.isSuperAttacking) {
        playHitSound();
      } else {
        if (hitStep === 2) screenShake(40);
        if (hitStep === 3) {
          screenShake(80);
          hitstopRemain = Math.max(hitstopRemain, 0.12);
        }
        playComboHitSound(hitStep);
        player2.comboUiStep = hitStep;
        player2.comboUiTimer = 0.18;
      }
    } else if (player2.attackStart > 0) {
      player2.combo = 0;
    }
    if (lastSlashAttackIdP2 !== player2.currentAttackId) {
      lastSlashAttackIdP2 = player2.currentAttackId;
      const cx = player2.x + config.playerWidth / 2 + player2.facing * (config.playerWidth / 2 + 15);
      slashEffects.push({
        x: cx,
        y: player2.y + config.playerHeight / 2,
        facing: player2.facing,
        startTime: t,
        duration: 0.15,
        hit: anyHit,
      });
    }
  }

  function updatePlayer2(dt, t) {
    if (!isCoopMode) return;
    if (player2.hp <= 0 && player2.state !== 'dead') {
      player2.hp = 0;
      player2.state = 'dead';
      player2.anim = 'idle';
      if (deathSpriteP2) deathSpriteP2.playOnce();
    }
    if (player2.state === 'dead') {
      if (deathSpriteP2 && deathSpriteP2.img) deathSpriteP2.update(dt);
      return;
    }
    if (isVersusMode && versusPhase !== 'fighting') {
      player2.vx = 0;
      player2.vy = 0;
      return;
    }
    if (tickPlayerKnockback(player2, dt, t)) return;

    player2.state = 'alive';
    player2.anim = 'idle';
    if (player2.blockFlashTimer > 0) player2.blockFlashTimer = Math.max(0, player2.blockFlashTimer - dt);
    if (player2.blockShakeTimer > 0) player2.blockShakeTimer = Math.max(0, player2.blockShakeTimer - dt);
    if (player2.shieldGoldTimer > 0) player2.shieldGoldTimer = Math.max(0, player2.shieldGoldTimer - dt);
    player2.shieldPulseTimer = (player2.shieldPulseTimer || 0) + dt;
    if (player2.shieldPulseActive) {
      player2.shieldPulseAge += dt;
      if (player2.shieldPulseAge >= 0.3) {
        player2.shieldPulseAge = 0;
        player2.shieldPulseActive = false;
      }
    }
    if (player2.dodgeCooldown > 0) player2.dodgeCooldown = Math.max(0, player2.dodgeCooldown - dt);
    for (let i = shieldParticlesP2.length - 1; i >= 0; i--) {
      const p = shieldParticlesP2[i];
      p.theta += p.speed * dt;
      p.life -= dt;
      if (p.life <= 0) shieldParticlesP2.splice(i, 1);
    }
    for (let i = shieldSparksP2.length - 1; i >= 0; i--) {
      const p = shieldSparksP2[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt;
      if (p.life <= 0) shieldSparksP2.splice(i, 1);
    }
    let vx = 0;
    let moveSpd = config.playerSpeed;
    if (player2.godThorMoveActive && thorMode) moveSpd *= 2;
    const demonFlying2 = player2.godDemonFlyRemain > 0 && demonMode;
    if (keys['ArrowLeft']) {
      vx = -moveSpd;
      player2.facing = -1;
    }
    if (keys['ArrowRight']) {
      vx = moveSpd;
      player2.facing = 1;
    }
    const inAtk = player2.attackStart > 0 && t - player2.attackStart < (player2.attackDurationSec || config.attackDuration / 1000);
    const blockHeld = !!keys['KeyM'];
    if (!player2.isDodging && !inAtk && !player2.isSuperAttacking) {
      player2.isBlocking = blockHeld;
      if (blockHeld && !player2.blockHeldLast) {
        player2.blockStartTime = t;
        player2.blockLastPressTime = t;
      }
    } else {
      player2.isBlocking = false;
    }
    player2.blockHeldLast = blockHeld;

    const canStartDash =
      player2.state === 'alive' &&
      !inAtk &&
      !player2.isSuperAttacking &&
      !player2.isBlocking &&
      !player2.isDodging &&
      player2.dodgeCooldown <= 0;
    if (player2.dodgeTriggerCount > 0 && canStartDash) {
      player2.dodgeTriggerCount--;
      let dir = 0;
      if (keys['ArrowLeft']) dir = -1;
      else if (keys['ArrowRight']) dir = 1;
      else dir = player2.facing || 1;
      player2.isDodging = true;
      player2.dodgeDir = dir;
      player2.dodgeTimer = player2.dodgeDuration;
      player2.dodgeCooldown = player2.dodgeCooldownMax;
      player2.dodgeTrailTimer = 0;
      player2.vy = 0;
      playDodgeSound();
    }

    if (player2.isDodging) {
      player2.isBlocking = false;
      player2.dodgeTimer -= dt;
      vx = player2.dodgeDir * player2.dodgeSpeed;
      player2.dodgeTrailTimer -= dt;
      if (player2.dodgeTrailTimer <= 0) {
        player2.dodgeTrailTimer = 0.04;
        dodgeAfterimages.push({ x: player2.x, y: player2.y, alpha: 0.42 });
        if (dodgeAfterimages.length > 4) dodgeAfterimages.shift();
      }
      if (player2.dodgeTimer <= 0) {
        player2.isDodging = false;
        player2.dodgeTimer = 0;
      }
    } else if (player2.isBlocking) {
      vx *= 0.3;
    }

    if (player2.isBlocking && !player2.isDodging) {
      if (shieldParticlesP2.length < 5 && Math.random() < 0.22) {
        shieldParticlesP2.push({
          theta: (player2.facing === 1 ? -Math.PI / 2 : Math.PI / 2) + Math.random() * Math.PI,
          speed: 0.6 + Math.random() * 1.0,
          size: 1.5 + Math.random() * 1.5,
          life: 1.1 + Math.random() * 0.5,
          maxLife: 1.6,
        });
      }
      if (player2.shieldPulseTimer >= 0.8) {
        player2.shieldPulseTimer = 0;
        player2.shieldPulseAge = 0;
        player2.shieldPulseActive = true;
      }
    } else {
      shieldParticlesP2.length = Math.min(shieldParticlesP2.length, 8);
    }

    const bHeld = !!keys['KeyB'];
    const bPressed = bHeld && !player2.bHeldLast;
    player2.bHeldLast = bHeld;
    if (player2.comboStep > 0 && player2.comboNextDeadline > 0) {
      player2.comboTimer = Math.max(0, player2.comboNextDeadline - t);
      if (player2.comboTimer <= 0) {
        player2.comboStep = 0;
        player2.comboTimer = 0;
        player2.comboActiveStep = 0;
        player2.comboNextDeadline = 0;
      }
    }

    if (
      bPressed &&
      !(gunnerMode && !martialMode && player2.godRageActive) &&
      !inAtk &&
      !player2.isSuperAttacking &&
      !player2.isBlocking &&
      !player2.isDodging &&
      t >= player2.attackCooldownEnd
    ) {
      let step = 1;
      if (player2.comboStep === 0 || player2.comboTimer <= 0) step = 1;
      else if (player2.comboStep === 1) step = 2;
      else if (player2.comboStep === 2) step = 3;
      const combo = comboData[step - 1];
      player2.comboStep = step;
      player2.comboActiveStep = step;
      player2.comboTimer = player2.comboWindowMax;
      player2.comboNextDeadline = t + combo.duration + player2.comboWindowMax;
      player2.currentAttackId += 1;
      player2.attackStart = t;
      player2.attackDurationSec = combo.duration;
      player2.attackCooldownEnd = t + combo.cooldown * getPlayerAttackCooldownScale();
      vx += (player2.facing || 1) * combo.dashForce;
      spawnPunchWind(step, player2);
      spawnComboName(step, player2);
      spawnBerserkerPunchRedParticles(step, player2);
      spawnRoninSwordQiOnNormalAttack(player2);
      spawnXianglongDragonPalmOnNormalAttack(player2);
      if (punchSpriteP2) punchSpriteP2.playOnce();
    }

    if (
      keys['KeyN'] &&
      player2.superAttackCooldown <= 0 &&
      !inAtk &&
      !player2.isSuperAttacking &&
      !player2.isBlocking &&
      !player2.isDodging
    ) {
      player2.isSuperAttacking = true;
      player2.comboStep = 0;
      player2.comboTimer = 0;
      player2.comboActiveStep = 0;
      player2.comboNextDeadline = 0;
      player2.superAttackTimer = player2.superAttackDuration;
      player2.superAttackCooldown = player2.superAttackCooldownMax;
      player2.currentAttackId += 1;
      player2.attackStart = t;
      player2.attackDurationSec = player2.superAttackDuration / 1000;
      screenShake(200);
      playSuperPunchSound();
      spawnBerserkerSuperPunchRedParticles(player2);
    }

    if (keys['ArrowUp'] && (player2.onGround || demonFlying2) && !player2.isDodging) {
      if (demonFlying2) {
        player2.vy -= 520 * dt;
        player2.vy = Math.max(-340, player2.vy);
      } else {
        player2.vy = config.jumpForce;
        player2.onGround = false;
      }
    }
    if (demonFlying2 && keys['ArrowDown']) {
      player2.vy += 420 * dt;
      player2.vy = Math.min(340, player2.vy);
    }

    player2.vx = vx;
    if (player2.isSuperAttacking) {
      player2.superAttackTimer -= dt * 1000;
      if (player2.superAttackTimer <= 0) player2.isSuperAttacking = false;
      else {
        player2.superAttackFrame = Math.floor(
          (player2.superAttackDuration - player2.superAttackTimer) /
          (player2.superAttackDuration / 4)
        );
      }
    }
    if (player2.superAttackCooldown > 0) {
      player2.superAttackCooldown -= dt * 1000;
      if (player2.superAttackCooldown < 0) player2.superAttackCooldown = 0;
    }
    if (player2.attackStart > 0 && t - player2.attackStart > (player2.attackDurationSec || config.attackDuration / 1000)) {
      player2.attackStart = 0;
      if (!player2.isSuperAttacking && player2.comboStep === 0) player2.combo = 0;
    }
    if (demonFlying2) {
      player2.vy += config.gravity * 0.14 * dt;
      player2.x += player2.vx * dt;
      player2.y += player2.vy * dt;
      const topY2 = 24;
      const groundY2 = config.groundY - config.playerHeight;
      if (player2.y > groundY2) {
        player2.y = groundY2;
        player2.vy = Math.min(0, player2.vy);
        player2.onGround = true;
      } else {
        player2.onGround = false;
      }
      if (player2.y < topY2) {
        player2.y = topY2;
        player2.vy = Math.max(0, player2.vy);
      }
    } else {
      player2.vy += config.gravity * dt;
      player2.x += player2.vx * dt;
      player2.y += player2.vy * dt;
      if (player2.y >= config.groundY - config.playerHeight) {
        player2.y = config.groundY - config.playerHeight;
        player2.vy = 0;
        player2.onGround = true;
      }
    }

    if (player2.godDemonFlyRemain > 0 && demonMode && StageController.state !== 'transition') {
      player2.godDemonFlyRemain -= dt;
      if (player2.godDemonFlyRemain < 0) player2.godDemonFlyRemain = 0;
    }

    player2.x = Math.max(0, Math.min(config.width - config.playerWidth, player2.x));
    if (player2.hp <= 0) player2.anim = 'dead';
    else if (player2.attackStart > 0 && t - player2.attackStart < (player2.attackDurationSec || config.attackDuration / 1000)) player2.anim = 'attack';
    else if (Math.abs(player2.vx) > 0.1) player2.anim = 'run';
    else player2.anim = 'idle';
  }

  function syncPlayerAnimAction(t) {
    if (!playerAnim) return;
    const inAttack = player.attackStart > 0 && t - player.attackStart < (player.attackDurationSec || config.attackDuration / 1000);
    let want = 'idle';
    if (player.hp <= 0) want = 'dead';
    else if (inAttack) want = 'attack';
    else if (!player.onGround) want = 'jump';
    else if (Math.abs(player.vx) > 0.1) want = 'run';
    if (playerAnim.getCurrentAction() !== want) playerAnim.play(want);
  }

  // ========== Boss 类（两阶段：普攻3连+冲锋 / 狂暴后+AOE+加速） ==========
  const Boss = {
    // 阶段2 时攻击与技能冷却缩短为 1/1.2
    speed(boss) {
      return boss.bossPhase === 2 ? config.bossPhase2SpeedScale : 1;
    },

    // 检测并执行阶段切换（50% 血以下进入狂暴）
    checkPhase(boss) {
      if (boss.bossPhase !== 1) return;
      if (boss.hp > 0 && boss.hp / boss.maxHp <= 0.5) {
        boss.bossPhase = 2;
        boss.color = '#f97316';
        boss.enragedLabelTimer = config.bossEnragedLabelDuration;
        screenShake(config.bossEnragedShakeDuration);
        triggerBossPhase2Music();
      }
    },

    // 尝试对玩家造成一次近战伤害（攻击判定框与玩家重叠）
    tryHitPlayer(boss, t) {
      const w = 50;
      const left = boss.facing === 1 ? boss.x + boss.width : boss.x - w;
      const aBox = { left, right: left + w, top: boss.y + 20, bottom: boss.y + boss.height - 20 };
      tryDamagePlayersByBox(aBox, boss.bossMeleeDamage ?? config.bossAttackDamage, t, boss);
    },

    tryContactDamageInAttackStates(boss, t) {
      if (
        boss.state !== 'attackWindup' &&
        boss.state !== 'attackCombo' &&
        boss.state !== 'charge' &&
        boss.state !== 'aoeWindup'
      ) return;
      if (boss.contactHitCooldownEnd && t < boss.contactHitCooldownEnd) return;
      const aBox = {
        left: boss.x + 8,
        right: boss.x + boss.width - 8,
        top: boss.y + 10,
        bottom: boss.y + boss.height - 10,
      };
      if (tryDamagePlayersByBox(aBox, boss.bossMeleeDamage ?? config.bossAttackDamage, t, boss)) {
        boss.contactHitCooldownEnd = t + 0.22;
      }
    },

    update(boss, dt, t) {
      const centerX = boss.x + boss.width / 2;
      const target = pickEnemyTargetPlayer(boss);
      const playerCenterX = target.x + config.playerWidth / 2;
      const dist = Math.abs(playerCenterX - centerX);
      const dir = Math.sign(playerCenterX - centerX) || 1;
      boss.facing = dir;
      Boss.tryContactDamageInAttackStates(boss, t);

      Boss.checkPhase(boss);

      const s = Boss.speed(boss);
      const attackWindup = config.bossAttackWindup / s;
      const comboInterval = config.bossComboInterval / s;
      const attackCooldown = config.bossAttackCooldown / s;
      const chargeCooldown = config.bossChargeCooldown / s;
      const aoeCooldown = config.bossAoeCooldown / s;

      if (boss.enragedLabelTimer > 0) boss.enragedLabelTimer -= dt;

      // ---- 状态：冲锋中 ----
      if (boss.state === 'charge') {
        boss.x += boss.vx * dt;
        boss.stateTimer -= dt;
        if (boss.stateTimer <= 0) {
          boss.vx = 0;
          boss.state = 'walk';
          boss.chargeCooldownRemain = chargeCooldown;
        }
        boss.x = Math.max(0, Math.min(config.width - boss.width, boss.x));
        return;
      }

      // ---- 状态：攻击前摇 ----
      if (boss.state === 'attackWindup') {
        boss.vx = 0;
        boss.stateTimer -= dt;
        if (boss.stateTimer <= 0) {
          boss.state = 'attackCombo';
          boss.stateTimer = 0;
          boss.comboHitIndex = 0;
        }
        boss.x = Math.max(0, Math.min(config.width - boss.width, boss.x));
        return;
      }

      // ---- 状态：3连击（每击在固定时刻触发一次） ----
      if (boss.state === 'attackCombo') {
        boss.vx = 0;
        boss.stateTimer += dt;
        if (boss.comboHitIndex < config.bossComboHits) {
          const nextHitTime = (boss.comboHitIndex + 1) * comboInterval;
          if (boss.stateTimer >= nextHitTime && (boss.stateTimer - dt) < nextHitTime) {
            Boss.tryHitPlayer(boss, t);
            boss.comboHitIndex += 1;
          }
        }
        const totalComboTime = config.bossComboHits * comboInterval + 0.2;
        if (boss.stateTimer >= totalComboTime) {
          boss.state = 'walk';
          boss.attackCooldownRemain = attackCooldown;
        }
        boss.x = Math.max(0, Math.min(config.width - boss.width, boss.x));
        return;
      }

      // ---- 状态：AOE 前摇（仅阶段2） ----
      if (boss.state === 'aoeWindup') {
        boss.vx = 0;
        boss.stateTimer -= dt;
        if (boss.stateTimer <= 0) {
          bossAoes.push({
            x: centerX,
            y: config.groundY,
            radius: 0,
            life: config.bossAoeDuration,
            hitDone: false,
            damage: boss.bossAoeDamageScaled ?? config.bossAoeDamage,
          });
          boss.state = 'walk';
          boss.aoeCooldownRemain = aoeCooldown;
        }
        boss.x = Math.max(0, Math.min(config.width - boss.width, boss.x));
        return;
      }

      // ---- 状态：行走 / 决策 ----
      boss.attackCooldownRemain = (boss.attackCooldownRemain || 0) - dt;
      boss.chargeCooldownRemain = (boss.chargeCooldownRemain || 0) - dt;
      if (boss.bossPhase === 2) boss.aoeCooldownRemain = (boss.aoeCooldownRemain || 0) - dt;

      const inRange = dist < 100;
      const canAttack = boss.attackCooldownRemain <= 0 && inRange;
      const canCharge = boss.chargeCooldownRemain <= 0;
      const canAoe = boss.bossPhase === 2 && boss.aoeCooldownRemain <= 0;

      if (canAttack) {
        boss.state = 'attackWindup';
        boss.stateTimer = attackWindup;
        boss.attackWarnTimer = 0.3;
        boss.attackCooldownRemain = 0;
        return;
      }
      if (canCharge) {
        boss.state = 'charge';
        boss.stateTimer = config.bossChargeDuration;
        boss.vx =
          dir * config.bossChargeSpeed * (boss.bossMoveScale ?? 1);
        boss.attackWarnTimer = 0.3;
        boss.chargeCooldownRemain = 0;
        return;
      }
      if (canAoe) {
        boss.state = 'aoeWindup';
        boss.stateTimer = config.bossAoeWindup / s;
        boss.attackWarnTimer = 0.3;
        boss.aoeCooldownRemain = 0;
        return;
      }

      // 默认：向玩家移动
      if (dist > 90) {
        boss.vx = dir * config.bossWalkSpeed * (boss.bossMoveScale ?? 1);
        boss.x += boss.vx * dt;
      } else {
        boss.vx = 0;
      }
      boss.x = Math.max(0, Math.min(config.width - boss.width, boss.x));
    },
  };

  // 根据敌人状态同步动画动作
  function syncEnemyAnimAction(enemy, t) {
    if (isAxeEnemy(enemy)) {
      if (enemy.hp <= 0) {
        if (!enemy.isDying) {
          enemy.isDying = true;
          playEnemyAnim(enemy, 'death');
        }
        return;
      }
      const inKnockback = enemy.knockbackEnd > 0 && t < enemy.knockbackEnd;
      let want = 'idle';
      if (inKnockback) {
        want = 'hurt';
      } else if (
        enemy.state === 'attack' ||
        enemy.state === 'attackWindup' ||
        enemy.state === 'attackCombo' ||
        enemy.state === 'aoeWindup'
      ) {
        if (
          enemy.lastStateForAnim !== 'attack' &&
          enemy.lastStateForAnim !== 'windup' &&
          enemy.lastStateForAnim !== 'attackWindup' &&
          enemy.lastStateForAnim !== 'attackCombo' &&
          enemy.lastStateForAnim !== 'aoeWindup'
        ) {
          enemy.attackAnim = Math.random() < 0.5 ? 'attack1' : 'attack2';
        }
        want = enemy.attackAnim;
      } else if (
        enemy.state === 'charge' ||
        enemy.state === 'chase' ||
        enemy.state === 'walk' ||
        Math.abs(enemy.vx) > 0.1
      ) {
        want = 'walk';
      } else {
        want = 'idle';
      }
      enemy.lastStateForAnim = enemy.state;
      playEnemyAnim(enemy, want);
      return;
    }

    if (isSecEnemy(enemy)) {
      if (enemy.hp <= 0) {
        if (!enemy.isDying) {
          enemy.isDying = true;
          playEnemyAnim(enemy, 'death');
        }
        return;
      }
      const inKnockback = enemy.knockbackEnd > 0 && t < enemy.knockbackEnd;
      let want = 'idle';
      if (inKnockback) {
        want = 'hurt';
      } else if (
        enemy.state === 'attack' ||
        enemy.state === 'attackCombo'
      ) {
        if (
          enemy.lastStateForAnim !== 'attack' &&
          enemy.lastStateForAnim !== 'attackCombo'
        ) {
          enemy.attackAnim = Math.random() < 0.5 ? 'attack1' : 'attack2';
        }
        want = enemy.attackAnim || 'attack1';
      } else if (
        enemy.state === 'charge' ||
        enemy.state === 'chase' ||
        enemy.state === 'walk' ||
        Math.abs(enemy.vx) > 0.1
      ) {
        want = 'walk';
      } else {
        want = 'idle';
      }
      enemy.lastStateForAnim = enemy.state;
      playEnemyAnim(enemy, want);
      return;
    }

    if (!isMiniZombie(enemy)) {
      if (enemy.hp <= 0) {
        if (enemy.isBoss) {
          if (!enemy.isDying) {
            enemy.isDying = true;
            enemy.deathAnim = Math.random() < 0.5 ? 'death1' : 'death2';
            playEnemyAnim(enemy, enemy.deathAnim);
          }
        }
        return;
      }
      const inKnockback = enemy.knockbackEnd > 0 && t < enemy.knockbackEnd;
      let want = 'idle';
      if (inKnockback) want = 'hurt';
      else if (enemy.isBoss) {
        if (enemy.state === 'attackWindup' || enemy.state === 'attackCombo' || enemy.state === 'aoeWindup') {
          if (enemy.state === 'attackCombo' && typeof enemy.comboHitIndex === 'number') {
            want = enemy.comboHitIndex % 2 === 0 ? 'attack1' : 'attack2';
          } else {
            if (enemy.lastStateForAnim !== enemy.state) {
              enemy.attackAnim = Math.random() < 0.5 ? 'attack1' : 'attack2';
            }
            want = enemy.attackAnim || 'attack1';
          }
        }
        else if (enemy.state === 'charge' || enemy.vx !== 0) want = 'run';
        else want = 'idle';
      } else {
        if (enemy.state === 'attack') want = 'attack';
        else if (enemy.state === 'charge') want = 'run';
        else if (Math.abs(enemy.vx) > 0.1) want = 'run';
        else want = 'idle';
      }
      if (enemy.animAction !== want) playEnemyAnim(enemy, want);
      enemy.lastStateForAnim = enemy.state;
      return;
    }

    if (enemy.hp <= 0) {
      if (!enemy.isDying) {
        enemy.isDying = true;
        playEnemyAnim(enemy, 'death');
      }
      return;
    }
    const inKnockback = enemy.knockbackEnd > 0 && t < enemy.knockbackEnd;
    let want = 'idle';
    if (inKnockback) {
      want = 'hurt';
    } else if (
      enemy.state === 'attack' ||
      enemy.state === 'attackWindup' ||
      enemy.state === 'attackCombo' ||
      enemy.state === 'aoeWindup'
    ) {
      if (
        enemy.lastStateForAnim !== 'attack' &&
        enemy.lastStateForAnim !== 'windup' &&
        enemy.lastStateForAnim !== 'attackWindup' &&
        enemy.lastStateForAnim !== 'attackCombo' &&
        enemy.lastStateForAnim !== 'aoeWindup'
      ) {
        enemy.attackAnim = Math.random() < 0.5 ? 'attack1' : 'attack2';
      }
      want = enemy.attackAnim;
    } else if (
      enemy.state === 'charge' ||
      enemy.state === 'chase' ||
      enemy.state === 'walk' ||
      Math.abs(enemy.vx) > 0.1
    ) {
      want = 'walk';
    } else {
      want = 'idle';
    }
    enemy.lastStateForAnim = enemy.state;
    playEnemyAnim(enemy, want);
  }

  // ========== 敌人 AI 更新 ==========
  function updateEnemies(dt, t) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (enemy.attackWarnTimer > 0) enemy.attackWarnTimer = Math.max(0, enemy.attackWarnTimer - dt);

      // 小怪和中型怪播放各自动画死亡后移除
      if ((isMiniZombie(enemy) || isAxeEnemy(enemy) || isSecEnemy(enemy)) && enemy.hp <= 0) {
        syncEnemyAnimAction(enemy, t);
        updateEnemyAnim(enemy, dt);
        if (enemy.deathPlayed) enemies.splice(i, 1);
        continue;
      }

      // 远程/普通敌人：hp<=0 时不应继续 AI（否则仍会发射炮弹但身体已隐形）
      // Boss 例外：需要播放 death 动画后再移除
      if (!enemy.isBoss && !isMiniZombie(enemy) && !isAxeEnemy(enemy) && !isSecEnemy(enemy) && enemy.hp <= 0) {
        enemies.splice(i, 1);
        continue;
      }

      syncEnemyAnimAction(enemy, t);
      updateEnemyAnim(enemy, dt);
      if (enemy.isBoss && enemy.deathPlayed) {
        enemies.splice(i, 1);
        continue;
      }

      // 受击 knockback 期间：应用速度、重力与地面摩擦，并暂时停止 AI
      if (enemy.knockbackEnd > 0 && t < enemy.knockbackEnd) {
        // 重力影响（垂直后弹）
        enemy.vy += config.gravity * dt;
        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;

        const ground = config.groundY - enemy.height;
        if (enemy.y >= ground) {
          enemy.y = ground;
          enemy.vy = 0;
        }

        // 地面摩擦：速度逐渐衰减（修复版）
        enemy.vx *= 0.92;

        enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
        continue;
      }

      // 强制落地修复：每帧施加重力并做地面钳制，避免飞天卡住
      const ground = config.groundY - enemy.height;
      enemy.vy += config.gravity * dt;
      enemy.y += enemy.vy * dt;
      if (enemy.y >= ground) {
        enemy.y = ground;
        enemy.vy = 0;
        if (enemy.evadeLandingInvulnPending) {
          enemy.invulnerableUntil = Math.max(enemy.invulnerableUntil || 0, t + 0.2);
          enemy.evadeLandingInvulnPending = false;
        }
      }
      enemy.vx *= 0.92;

      // 叠加更聪明的互动 AI（不替换原有 A/B/C 逻辑）
      if (!enemy.isBoss) {
        const enableReactiveAI = !isSecEnemy(enemy);
        let nextTier = 'mid';
        if (enemy.hp > enemy.maxHp * 0.7) nextTier = 'high';
        else if (enemy.hp < enemy.maxHp * 0.3) nextTier = 'low';
        if (enemy.hpStrategyTier !== nextTier) {
          enemy.hpStrategyTier = nextTier;
          hpStrategyFlashRemain = 0.12;
        }
        if (enemy.hpStrategyTier === 'high') {
          enemy.speedStrategyMul = 1.2;      // hp > 70%：速度 +20%
          enemy.attackCdStrategyMul = 0.8;   // 攻击冷却 -20%
        } else if (enemy.hpStrategyTier === 'low') {
          enemy.speedStrategyMul = 0.8;      // hp < 30%：速度 -20%
          enemy.attackCdStrategyMul = 1;
        } else {
          enemy.speedStrategyMul = 1;
          enemy.attackCdStrategyMul = 1;
        }

        const centerX = enemy.x + enemy.width / 2;
        const playerCenterX = player.x + config.playerWidth / 2;
        const dist = Math.abs(playerCenterX - centerX);
        const dirToPlayer = Math.sign(playerCenterX - centerX) || 1;
        enemy.facing = dirToPlayer;
        const lowHpReact = enemy.hp <= enemy.maxHp * 0.5;

        // 每帧反应：玩家起手攻击时，近距离立即判定预判躲避（每次攻击最多触发一次）
        const playerIsAttacking = player.anim === 'attack' || player.isSuperAttacking;
        const currentAttackId = player.currentAttackId || 0;
        if (
          playerIsAttacking &&
          currentAttackId > 0 &&
          enemy.lastPredodgeAttackId !== currentAttackId &&
          dist < 200 &&
          t >= (enemy.preEvadeCooldownEnd || 0)
        ) {
          enemy.lastPredodgeAttackId = currentAttackId;
          const openingWindow = Math.random() < 0.25; // 留破绽，避免太难
          let predodgeProb = 0.5;
          if (lowHpReact) predodgeProb += 0.2;
          predodgeProb = Math.min(0.8, predodgeProb);
          if (!openingWindow && Math.random() < predodgeProb) {
            const predodgeCd = (0.03 + Math.random() * 0.05) * (lowHpReact ? 0.7 : 1); // 延迟<0.1s
            enemy.preEvadeCooldownEnd = t + predodgeCd;
            if (Math.random() < 0.5 && enemy.y >= ground - 1) {
              enemy.vy = -300;
              enemy.evadeLandingInvulnPending = true;
              enemy.evadeUntil = t + 0.22;
              enemy.evadeDir = 0;
            } else {
              // 按你的规则：vx -= 350 * dir
              enemy.vx -= 350 * dirToPlayer;
              enemy.evadeUntil = t + 0.24;
              enemy.evadeDir = -dirToPlayer;
            }
          }
        }

        // 距离 > 300：主动加速逼近（在原有移动基础上额外推进）
        if (dist > 300) {
          const approachSpeed =
            (enemy.aiWalkSpeed ?? config.typeAWalkSpeed) * 0.45 * enemyDifficultySpeedMul(enemy);
          enemy.x += dirToPlayer * approachSpeed * dt;
          enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
        }

        // 每帧检查：距离 < 150 有概率躲避
        if (enableReactiveAI && dist < 150 && t >= (enemy.evadeDecisionCooldownEnd || 0)) {
          enemy.evadeDecisionCooldownEnd = t + (lowHpReact ? 0.21 : 0.3);
          const openingWindow = Math.random() < 0.26; // 留破绽
          let evadeProb = 0.3;
          if (lowHpReact) evadeProb += 0.15;
          if (!openingWindow && Math.random() < Math.min(0.68, evadeProb)) {
            if (Math.random() < 0.5) {
              enemy.evadeUntil = t + 0.26;
              enemy.evadeDir = -dirToPlayer;
            } else if (enemy.y >= ground - 1) {
              enemy.vy = -300;
              enemy.evadeUntil = t + 0.22;
              enemy.evadeDir = 0;
            }
          }
        }

        // 每帧检查：反击冷却 0.6s；距离 < 120 概率 45%；低血再提速+提概率
        if (enableReactiveAI && dist < 170 && t >= (enemy.counterCooldownEnd || 0)) {
          const openingWindow = Math.random() < 0.24; // 保留可打窗口
          let counterProb = dist < 120 ? 0.45 : 0.35;
          if (lowHpReact) counterProb += 0.15;
          const reactCdMul = lowHpReact ? 0.7 : 1;
          const counterCd = 2.0 * reactCdMul;
          enemy.counterCooldownEnd = t + counterCd;

          if (!openingWindow && Math.random() < Math.min(0.75, counterProb)) {
            enemy.isCountering = true;
            enemy.counterHitDone = false;
            enemy.counterDamage = Math.max(1, Math.round(12 * (enemy.difficultyDmgMul ?? 1)));
            enemy.state = 'attack';
            enemy.stateTimer = 0;
            enemy.vx = 0;
          }
        }

        if (enemy.isCountering) {
          updateEnemyCounter(enemy, dt, t);
          enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
          continue;
        }

        if (enemy.evadeUntil > t && enemy.evadeDir !== 0) {
          const evadeSpeed =
            (enemy.aiWalkSpeed ?? config.typeAWalkSpeed) * 1.35 * enemyDifficultySpeedMul(enemy);
          enemy.vx = enemy.evadeDir * evadeSpeed;
          enemy.x += enemy.vx * dt;
          enemy.x = Math.max(0, Math.min(config.width - enemy.width, enemy.x));
          continue;
        }
      }

      const template = getAITemplate(enemy);
      if (template && AIBehaviors[template]) {
        AIBehaviors[template](enemy, dt, t);
        continue;
      }

      if (enemy.isBoss) {
        Boss.update(enemy, dt, t);
      }
    }
  }

  // ========== 子弹 / AOE 更新 ==========
  function updateProjectiles(dt) {
    const r = 5;
    for (const p of projectiles) {
      p.x += p.vx * dt;
      p.life -= dt;
      const b = { left: p.x - r, right: p.x + r, top: p.y - r, bottom: p.y + r };
      if (tryDamagePlayersByBox(
        b,
        p.damage ?? config.projectileDamage,
        performance.now() / 1000,
        p.owner || null,
        'projectile'
      )) {
        p.life = 0;
      }
    }
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      if (p.life <= 0 || p.x < -50 || p.x > config.width + 50) {
        projectiles.splice(i, 1);
      }
    }
  }

  function updateHitParticles(dt) {
    const gy = config.groundY;
    const g = 600;
    for (const p of hitParticles) {
      if (p.noGravity) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      } else {
        p.vy += g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.y > gy) p.y = gy;
      }
    }
    for (let i = hitParticles.length - 1; i >= 0; i--) {
      if (hitParticles[i].life <= 0) hitParticles.splice(i, 1);
    }
  }

  function updateBerserkerDeathBeams(dt) {
    for (let i = berserkerDeathBeams.length - 1; i >= 0; i--) {
      berserkerDeathBeams[i].life -= dt;
      if (berserkerDeathBeams[i].life <= 0) berserkerDeathBeams.splice(i, 1);
    }
  }

  function updateBloodStains(dt) {
    for (const s of bloodStains) s.life -= dt;
    for (let i = bloodStains.length - 1; i >= 0; i--) {
      if (bloodStains[i].life <= 0) bloodStains.splice(i, 1);
    }
  }

  function updateBleedEffects(dt) {
    for (let i = bleedEffects.length - 1; i >= 0; i--) {
      const b = bleedEffects[i];
      b.frameTimer += dt * 1000;
      while (b.frameTimer >= b.frameMs) {
        b.frameTimer -= b.frameMs;
        b.frame += 1;
        const framesInThisShot = b.shotFrames[b.shotIndex] || 1;
        if (b.frame >= framesInThisShot) {
          b.frame = 0;
          b.shotIndex += 1;
          if (b.shotIndex >= b.shotImgs.length) {
            bleedEffects.splice(i, 1);
            break;
          }
        }
      }
      if (i >= 0 && bleedEffects[i] === b) {
        b.vy = (b.vy || 0) + (b.gravity || 0) * dt;
        b.y += (b.vy || 0) * dt;
        b.x += (b.vx || 0) * dt;
      }
    }
  }

  function updatePlayerBullets(dt, t) {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const b = playerBullets[i];
      const prevX = b.x;
      const prevY = b.y;
      b.x += b.vx * dt;
      b.y += (b.vy || 0) * dt;
      const movedDist = Math.hypot(b.x - prevX, b.y - prevY);
      if (b.trail) {
        b.trail.emit(b.x, b.y, movedDist);
        b.trail.update(dt);
      }
      b.life -= dt;
      if (
        b.life <= 0 ||
        b.x < -40 ||
        b.x > config.width + 40 ||
        b.y < -60 ||
        b.y > config.height + 40
      ) {
        orphanGunnerBulletTrail(b.trail);
        b.trail = null;
        playerBullets.splice(i, 1);
        continue;
      }

      for (const enemy of enemies) {
        if (enemy.hp <= 0) continue;
        if (enemy.invulnerableUntil && t < enemy.invulnerableUntil) continue;
        const r = 4;
        const bBox = { left: b.x - r, right: b.x + r, top: b.y - r, bottom: b.y + r };
        const hitZone = gunnerMode ? getGunnerBulletHitZone(bBox, enemy) : null;
        if (gunnerMode) {
          if (!hitZone) continue;
        } else {
          const eBox = getEnemyHitbox(enemy);
          if (!boxesOverlap(bBox, eBox)) continue;
        }

        const headBox = gunnerMode ? getEnemyHeadHitbox(enemy) : null;
        const flashX = hitZone === 'head' && headBox
          ? (headBox.left + headBox.right) / 2
          : enemy.x + enemy.width / 2;
        const flashY = hitZone === 'head' && headBox
          ? (headBox.top + headBox.bottom) / 2
          : enemy.y + enemy.height / 2;
        hitFlashEffects.push({
          x: flashX,
          y: flashY,
          startTime: t,
          duration: hitZone === 'head' ? 0.1 : 0.06,
        });
        if (gunnerMode) {
          screenShake(GUNNER_BULLET_HIT_SHAKE_MS, GUNNER_BULLET_HIT_SHAKE_AMP, true);
        }

        const hpBeforeBullet = enemy.hp;
        const bulletDmg = getGunnerBulletDamageForEnemy(enemy, hitZone || 'body');
        enemy.hp = Math.max(0, enemy.hp - bulletDmg);
        if (hitZone === 'head') {
          GunnerHeadshotSfx.play();
          spawnHeadshotBurst(flashX, flashY, b.vx, b.vy);
        }
        if ((berserkerMode || angelMode || demonMode || thorMode || roninMode || gunnerMode || martialMode) && hpBeforeBullet > 0 && enemy.hp <= 0) {
          spawnBerserkerKillGoldBeam(enemy);
        }
        if (hpBeforeBullet > 0 && enemy.hp <= 0) {
          const anyAlive = enemies.some((e) => e.hp > 0);
          if (anyAlive) addKillImpactScreenShake(enemy);
          else if (!slowMotionTimer) {
            triggerSlowMotion(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              !!enemy.isBoss
            );
          }
        }
        enemy.vx += (Math.sign(b.vx || b.facing || 1)) * 180;
        enemy.vy -= 70;
        enemy.hurtEnd = Math.max(enemy.hurtEnd || 0, t + 0.08);
        orphanGunnerBulletTrail(b.trail);
        b.trail = null;
        playerBullets.splice(i, 1);
        break;
      }
    }

    updateGunnerBulletTrailRemnants(dt);

    for (let i = gunFireEffects.length - 1; i >= 0; i--) {
      const f = gunFireEffects[i];
      f.timer += dt * 1000;
      while (f.timer >= f.frameMs) {
        f.timer -= f.frameMs;
        f.frame += 1;
        if (f.frame >= 3) {
          gunFireEffects.splice(i, 1);
          break;
        }
      }
    }
  }

  function updateBossAoes(dt) {
    for (const a of bossAoes) {
      a.life -= dt;
      const progress = 1 - Math.max(a.life, 0) / config.bossAoeDuration;
      a.radius = config.bossAoeRadius * progress;
      if (!a.hitDone && progress >= 0.7) {
        const p1x = player.x + config.playerWidth / 2;
        const p1y = player.y + config.playerHeight / 2;
        const dx1 = p1x - a.x;
        const dy1 = p1y - a.y;
        if (dx1 * dx1 + dy1 * dy1 <= a.radius * a.radius) {
          applyDamageToPlayer(a.damage ?? config.bossAoeDamage, performance.now() / 1000, null, 'aoe');
          a.hitDone = true;
          continue;
        }
        if (isCoopMode && player2.state === 'alive') {
          const p2x = player2.x + config.playerWidth / 2;
          const p2y = player2.y + config.playerHeight / 2;
          const dx2 = p2x - a.x;
          const dy2 = p2y - a.y;
          if (dx2 * dx2 + dy2 * dy2 <= a.radius * a.radius) {
            applyDamageToPlayer2(a.damage ?? config.bossAoeDamage, performance.now() / 1000, null, 'aoe');
            a.hitDone = true;
          }
        }
      }
    }
    for (let i = bossAoes.length - 1; i >= 0; i--) {
      if (bossAoes[i].life <= 0) bossAoes.splice(i, 1);
    }
  }

  // ========== 玩家攻击命中检测 ==========
  function spawnBleedEffect(enemy) {
    const facing = enemy.facing || player.facing || 1;
    const cx = enemy.x + enemy.width / 2;
    const cy = enemy.y + enemy.height * 0.4;
    const drawW = Math.max(12, enemy.width * (enemy.isBoss ? 0.8 : 0.65));
    const drawH = Math.max(12, enemy.height * 0.35);
    bleedEffects.push({
      x: cx,
      y: cy,
      vx: (facing || 1) * 10,
      vy: -40,
      gravity: 420,
      frameMs: bleedFrameMs,
      frameTimer: 0,
      shotIndex: 0,
      frame: 0,
      shotFrames: bleedShotFrames,
      shotImgs: [bleedShot1Sprite, bleedShot2Sprite],
      drawW,
      drawH,
      facing,
    });
  }

  // ========== 连招拳风特效 ==========
  function spawnPunchWind(step, actor = player) {
    const cx =
      actor.facing === 1
        ? actor.x + config.playerWidth + 20
        : actor.x - 20;
    const cy = actor.y + config.playerHeight / 2;

    const radius = step === 1 ? 20 : step === 2 ? 30 : 40;
    punchWindEffects.push({
      x: cx,
      y: cy,
      radius,
      life: 0.15,
      maxLife: 0.15,
      facing: actor.facing || 1,
      step: step || 1,
    });
  }

  /** 与拳风弧同一中心（非身体），用于狂战士光束爆发 */
  function getPunchWindCenter(actor = player) {
    const facing = actor.facing || 1;
    const cx =
      facing === 1 ? actor.x + config.playerWidth + 20 : actor.x - 20;
    const cy = actor.y + config.playerHeight / 2;
    return { cx, cy, facing };
  }

  /** 狂战士 / 天使：J 连招 — 从拳风弧心射出方形光束段（天使为金色，无重力） */
  function spawnBerserkerPunchRedParticles(step, actor = player) {
    if (!berserkerMode) return;
    const { cx, cy, facing } = getPunchWindCenter(actor);
    const radius = step === 1 ? 20 : step === 2 ? 30 : 40;
    const n = 11 + (step >= 3 ? 12 : step === 2 ? 5 : 0);
    // 以前用 -π/2→π/2 线性插值会在中间得到角度 0，朝左打也会向右喷；改为绕「朝前」±90° 扇面
    const forward = facing === 1 ? 0 : Math.PI;
    const startFan = forward - Math.PI * 0.5;
    const endFan = forward + Math.PI * 0.5;
    for (let i = 0; i < n; i++) {
      const u = n <= 1 ? 0.5 : i / (n - 1);
      const ang =
        startFan +
        (endFan - startFan) * (u * 0.92 + Math.random() * 0.08) +
        (Math.random() - 0.5) * 0.22;
      const sp = 320 + Math.random() * 520;
      const lf = 0.2 + Math.random() * 0.14;
      const vx = Math.cos(ang) * sp;
      const vy = Math.sin(ang) * sp;
      const px = cx + Math.cos(ang + Math.PI / 2) * (Math.random() - 0.5) * radius * 0.55;
      const py = cy + Math.sin(ang + Math.PI / 2) * (Math.random() - 0.5) * radius * 0.55;
      hitParticles.push({
        x: px,
        y: py,
        vx,
        vy,
        life: lf,
        maxLife: lf,
        noGravity: true,
        isBerserkerBeam: true,
        isAngelGold: !!angelMode && !demonMode && !thorMode && !roninMode,
        isDemonDark: !!demonMode && !thorMode && !roninMode,
        isThorThunder: !!thorMode && !roninMode,
        beamL: 36 + Math.random() * 48,
        beamW: 3.5 + Math.random() * 4.5,
      });
    }
  }

  /** 狂战士 / 天使：超级拳 — 更宽扇面光束 */
  function spawnBerserkerSuperPunchRedParticles(actor = player) {
    if (!berserkerMode) return;
    const { cx, cy, facing } = getPunchWindCenter(actor);
    const n = 32;
    const forward = facing === 1 ? 0 : Math.PI;
    for (let i = 0; i < n; i++) {
      const ang =
        forward + (Math.random() - 0.5) * (Math.PI * 0.95);
      const sp = 380 + Math.random() * 620;
      const lf = 0.26 + Math.random() * 0.16;
      const vx = Math.cos(ang) * sp;
      const vy = Math.sin(ang) * sp;
      hitParticles.push({
        x: cx + (Math.random() - 0.5) * 28,
        y: cy + (Math.random() - 0.5) * 22,
        vx,
        vy,
        life: lf,
        maxLife: lf,
        noGravity: true,
        isBerserkerBeam: true,
        isAngelGold: !!angelMode && !demonMode && !thorMode && !roninMode,
        isDemonDark: !!demonMode && !thorMode && !roninMode,
        isThorThunder: !!thorMode && !roninMode,
        beamL: 48 + Math.random() * 72,
        beamW: 4 + Math.random() * 5,
      });
    }
  }

  function spawnBerserkerKillGoldBeam(enemy) {
    if (!(berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) || !enemy) return;
    berserkerDeathBeams.push({
      x: enemy.x + enemy.width / 2,
      targetY: enemy.y + enemy.height * 0.55,
      life: 0.58,
      maxLife: 0.58,
      width: 32 + Math.random() * 18,
      isDemonDark: !!demonMode && !thorMode && !roninMode,
      isThorThunder: !!thorMode && !roninMode,
      isRoninSilver: !!roninMode,
    });
  }

  // ========== 招式名称浮动 ==========
  function spawnComboName(step, actor = player) {
    const names = [
      { text: '轻拳 JAB', color: '#ffffff', size: 20 },
      { text: '重拳 CROSS', color: '#60a5fa', size: 26 },
      { text: '上勾拳 UPPERCUT', color: '#fbbf24', size: 32 },
    ];
    const info = names[(step || 0) - 1];
    if (!info) return;

    comboNameEffects.push({
      text: info.text,
      color: info.color,
      size: info.size,
      x: actor.x + config.playerWidth / 2,
      y: actor.y - 20,
      life: 0.8,
      maxLife: 0.8,
      vy: -40,
      step: step || 1,
      scale: 1.5,
    });
  }

  function handlePlayerAttack(t) {
    if (player.state !== 'alive') return;
    if (player.gunnerShootOnlyAnim) return;
    // 出拳命中窗口：0.07s ~ 0.14s
    const attackMid =
      player.attackStart > 0 &&
      t - player.attackStart >= 0.07 &&
      t - player.attackStart <= 0.14;

    if (!attackMid) return;

    const attackBox = getPlayerAttackBox();
    const attackStep = player.isSuperAttacking ? 0 : (player.comboActiveStep || player.comboStep || 0);
    let anyHit = false;

    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      // 在受击冷却期间忽略命中，避免多次抖动
      if (enemy.hurtEnd && t < enemy.hurtEnd) continue;
      if (enemy.invulnerableUntil && t < enemy.invulnerableUntil) continue;
      const eBox = getEnemyHitbox(enemy);
      if (boxesOverlap(attackBox, eBox) && enemy.lastHitAttackId !== player.currentAttackId) {
        enemy.lastHitAttackId = player.currentAttackId;
        const cx = enemy.x + enemy.width / 2;
        const cy = enemy.y + enemy.height / 2;
        hitFlashEffects.push({ x: cx, y: cy, startTime: t, duration: 0.08 });
        let n = 8 + Math.floor(Math.random() * 5);
        // 上勾拳：命中粒子翻倍
        if (attackStep === 3) n *= 2;
        for (let i = 0; i < n; i++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 200,
            vy: -100 - Math.random() * 120,
            life: 0.3,
            maxLife: 0.3,
          });
        }
        bloodStains.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: config.groundY,
          life: 1,
          maxLife: 1,
          w: 30 + Math.random() * 25,
          h: 12 + Math.random() * 10,
        });

        // 流血动画（所有敌人命中都触发）
        spawnBleedEffect(enemy);
        spawnRoninOmnislashOnMeleeHit(enemy, t);

        // 超级拳：黄色闪电粒子
        if (player.isSuperAttacking) {
          for (let i = 0; i < 7; i++) {
            hitParticles.push({
              x: cx,
              y: cy,
              vx: (Math.random() - 0.5) * 420,
              vy: (Math.random() - 0.5) * 420 - 80,
              life: 0.45,
              maxLife: 0.45,
              color: '#ffff00',
              isLightning: true,
            });
          }
        }
        if (
          player.godRageActive &&
          (getCurrentGodSkillTier() === 'berserker' ||
            getCurrentGodSkillTier() === 'ronin' ||
            getCurrentGodSkillTier() === 'gunner')
        ) {
          for (let i = 0; i < 10; i++) {
            hitParticles.push({
              x: cx,
              y: cy,
              vx: (Math.random() - 0.5) * 260,
              vy: -120 - Math.random() * 140,
              life: 0.35,
              maxLife: 0.35,
              noGravity: false,
              isRageRed: true,
            });
          }
          for (let i = 0; i < 8; i++) {
            hitParticles.push({
              x: cx,
              y: cy,
              vx: (Math.random() - 0.5) * 200,
              vy: -90 - Math.random() * 100,
              life: 0.4,
              maxLife: 0.4,
              isRageGold: true,
            });
          }
        }
        let dmg = getPlayerDamage(player);
        dmg *= getRoninGunnerMeleeMul();
        if (player.isSuperAttacking) {
          dmg *= 3; // 超级拳 3 倍伤害
        } else {
          // J 三段连招伤害倍率
          if (attackStep >= 1 && attackStep <= 3) dmg *= comboData[attackStep - 1].damageMul;
        }
        if (player.combo >= 3) {
          dmg *= 1.5;
          comboFlashRemain = 0.2;
        }
        const hpBefore = enemy.hp;
        enemy.hp = Math.max(0, enemy.hp - dmg);
        if ((berserkerMode || angelMode || demonMode || thorMode || roninMode || martialMode) && hpBefore > 0 && enemy.hp <= 0) {
          spawnBerserkerKillGoldBeam(enemy);
        }
        // 慢动作终结技：击杀当波最后一个敌人；其余击杀给震屏抖击
        if (hpBefore > 0 && enemy.hp <= 0) {
          const anyAlive = enemies.some((e) => e.hp > 0);
          if (anyAlive) addKillImpactScreenShake(enemy);
          else if (!slowMotionTimer) {
            const kx = enemy.x + enemy.width / 2;
            const ky = enemy.y + enemy.height / 2;
            triggerSlowMotion(kx, ky, !!enemy.isBoss);
          }
        }
        // ========== 击退逻辑（普通/超级拳 + J 三段）==========
        const dir = player.facing || 1;
        let kbX = player.isSuperAttacking ? 680 : 380;
        let kbY = player.isSuperAttacking ? -220 : -160;
        if (!player.isSuperAttacking) {
          if (attackStep >= 1 && attackStep <= 3) {
            const combo = comboData[attackStep - 1];
            kbX *= combo.knockbackMul;
            kbY *= combo.knockbackMul;
          }
        }
        enemy.vx += dir * kbX;
        enemy.vy = kbY;

        // 上勾拳额外击飞（更夸张的上冲）
        if (!player.isSuperAttacking && attackStep === 3) {
          enemy.vy -= 150;
          comboFlashRemain = Math.max(comboFlashRemain, 0.05); // 短暂闪白 0.05s
        }

        enemy.vx = Math.max(-config.maxKnockbackVx, Math.min(config.maxKnockbackVx, enemy.vx));
        enemy.knockbackEnd = t + config.hitstun;
        enemy.hurtEnd = t + config.hurtCooldown;

        const ls = getPlayerLifestealRatio();
        if (ls > 0) player.hp = Math.min(player.maxHp, player.hp + dmg * ls);
        player.combo += 1; // 每次命中敌人都累加连击
        if (player.combo === 5) {
          player.superAttackCooldown *= 0.5; // 5 连击时超级拳冷却减半
          playComboChime();
        }
        anyHit = true;
      }
    }

    if (
      (coopFriendlyFireEnabled || isVersusMode) &&
      isCoopMode &&
      player2.state === 'alive' &&
      boxesOverlap(attackBox, getPlayer2Hitbox()) &&
      player2.coopFriendlyLastHitAttackId !== player.currentAttackId
    ) {
      player2.coopFriendlyLastHitAttackId = player.currentAttackId;
      let ffDmg = getPlayerDamage(player);
      ffDmg *= getRoninGunnerMeleeMul();
      if (player.isSuperAttacking) ffDmg *= 3;
      else if (attackStep >= 1 && attackStep <= 3) ffDmg *= comboData[attackStep - 1].damageMul;
      if (player.combo >= 3) ffDmg *= 1.5;
      ffDmg = Math.max(1, Math.round(ffDmg));
      let kbX = player.isSuperAttacking ? 680 : 380;
      let kbY = player.isSuperAttacking ? -220 : -160;
      if (!player.isSuperAttacking && attackStep >= 1 && attackStep <= 3) {
        const cb = comboData[attackStep - 1];
        kbX *= cb.knockbackMul;
        kbY *= cb.knockbackMul;
      }
      const r = applyCoopFriendlyMeleeDamage(player2, player, ffDmg, t, kbX, kbY);
      if (r === 'hit') {
        const cx = player2.x + config.playerWidth / 2;
        const cy = player2.y + config.playerHeight / 2;
        for (let i = 0; i < 8; i++) {
          hitParticles.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 200,
            vy: -90 - Math.random() * 100,
            life: 0.28,
            maxLife: 0.28,
          });
        }
        doHitstop();
        if (player.isSuperAttacking) {
          screenShake(160);
          playHitSound();
        } else {
          playComboHitSound(attackStep || 1);
        }
        if (isVersusMode && !player.isSuperAttacking && attackStep === 3) {
          player2.vy -= 150 * VERSUS_KNOCKBACK_MUL;
          player2.knockbackEnd = Math.max(player2.knockbackEnd || 0, t + (config.hitstun || 0.12));
          comboFlashRemain = Math.max(comboFlashRemain, 0.05);
        }
        anyHit = true;
      } else if (r === 'blocked') {
        anyHit = true;
      }
    }

    if (anyHit) {
      const hitStep = player.isSuperAttacking ? 0 : (player.comboActiveStep || player.comboStep || 1);
      recordPlayerLandHit();
      doHitstop();

      if (player.isSuperAttacking) {
        screenShake(180); // 超级拳震动更明显一点
        playHitSound();
      } else {
        // 连招按段增强：轻/重/终结
        if (hitStep === 2) screenShake(40);
        if (hitStep === 3) {
          screenShake(80);
          hitstopRemain = Math.max(hitstopRemain, 0.12); // 更短更硬的“终结”屏顿
        }

        playComboHitSound(hitStep);

        // 连招命中UI（头顶）
        player.comboUiStep = hitStep;
        player.comboUiTimer = 0.18;
      }
    } else if (lastSlashAttackId !== player.currentAttackId) {
      player.combo = 0; // 这次出拳没命中：连击清零
    }
    if (lastSlashAttackId !== player.currentAttackId) {
      lastSlashAttackId = player.currentAttackId;
      const cx = player.x + config.playerWidth / 2 + player.facing * (config.playerWidth / 2 + 15);
      slashEffects.push({
        x: cx,
        y: player.y + config.playerHeight / 2,
        facing: player.facing,
        startTime: t,
        duration: 0.15,
        hit: anyHit,
      });
    }
  }

  // ========== 阶段配置与控制 ==========
  const level1Stages = [
    {
      name: 'WARM UP',
      label: 'WARM UP',
      enemies: [
        { type: 'melee', x: 520, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 600, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 680, y: config.groundY - config.enemyHeight },
      ],
    },
    {
      name: 'PRESSURE',
      label: 'PRESSURE',
      enemies: [
        { type: 'melee', x: 520, y: config.groundY - config.enemyHeight },
        { type: 'ranged', x: 680, y: config.groundY - config.enemyHeight },
        { type: 'charge', x: 580, y: config.groundY - config.enemyHeight },
      ],
    },
    {
      name: 'ELITE',
      label: 'ELITE',
      enemies: [
        { type: 'elite', x: 600, y: config.groundY - config.enemyHeight },
      ],
    },
  ];

  // 第二关：①6 普通 ②3 精英 ③精英+Boss+远程+冲刺+普通
  const level2Stages = [
    {
      name: 'L2_W1',
      label: 'WAVE 1',
      enemies: [
        { type: 'melee', x: 356, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 412, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 468, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 524, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 580, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 636, y: config.groundY - config.enemyHeight },
      ],
    },
    {
      name: 'L2_W2',
      label: 'WAVE 2',
      enemies: [
        { type: 'elite', x: 460, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 580, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 700, y: config.groundY - config.enemyHeight },
      ],
    },
    {
      name: 'L2_W3',
      label: 'WAVE 3',
      enemies: [
        { type: 'elite', x: 320, y: config.groundY - config.enemyHeight },
        { type: 'boss', x: 500, y: config.groundY - config.bossHeight },
        { type: 'ranged', x: 660, y: config.groundY - config.enemyHeight },
        { type: 'charge', x: 400, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 720, y: config.groundY - config.enemyHeight },
      ],
    },
  ];

  const level3Stages = [
    {
      name: 'L3_W1',
      label: 'WAVE 1',
      enemies: [
        { type: 'elite', x: 340, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 400, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 460, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 520, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 580, y: config.groundY - config.enemyHeight },
      ],
    },
    {
      name: 'L3_W2',
      label: 'WAVE 2',
      enemies: [
        { type: 'elite', x: 300, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 360, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 420, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 480, y: config.groundY - config.enemyHeight },
        { type: 'elite', x: 540, y: config.groundY - config.enemyHeight },
        { type: 'ranged', x: 680, y: config.groundY - config.enemyHeight },
        { type: 'charge', x: 260, y: config.groundY - config.enemyHeight },
      ],
    },
    {
      name: 'L3_W3',
      label: 'WAVE 3',
      enemies: [
        { type: 'boss', x: 320, y: config.groundY - config.bossHeight },
        { type: 'boss', x: 520, y: config.groundY - config.bossHeight },
      ],
    },
    {
      name: 'L3_W4',
      label: 'WAVE 4',
      enemies: [
        { type: 'melee', x: 320, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 380, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 440, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 500, y: config.groundY - config.enemyHeight },
        { type: 'melee', x: 560, y: config.groundY - config.enemyHeight },
      ],
    },
  ];

  /** 无尽：原 L1+L2+L3 全部波次顺序循环；endlessSection 仅用于换背景 */
  function buildEndlessStages() {
    const tag = (arr, sec) => arr.map((s) => ({ ...s, endlessSection: sec }));
    return [...tag(level1Stages, 1), ...tag(level2Stages, 2), ...tag(level3Stages, 3)];
  }
  const endlessStages = buildEndlessStages();

  let currentStages = endlessStages;
  let currentCampaignLevel = 1;
  let awaitingNextLevel = false;

  const StageController = {
    index: -1,
    state: 'idle',
    transitionTimer: 0,
    labelText: '',
    labelTimer: 0,
    labelDuration: 1.2,

    start() {
      this.gotoNextStage();
    },

    gotoNextStage() {
      this.index += 1;
      if (this.index >= currentStages.length) {
        if (isVersusMode) {
          this.state = 'finished';
          this.labelText = 'CLEAR';
          this.labelTimer = this.labelDuration;
          return;
        }
        // 无尽：每通一轮（原第三关全部波次之后）→ 敌人更难 + 与旧版相同的神阶结算升级；点 RETRY 后再开下一轮
        bumpEnemyClearRankAfterFinale();
        endlessCombatStack = Math.min(10, endlessCombatStack + 1);
        playerBullets.length = 0;
        gunnerBulletTrailRemnants.length = 0;
        projectiles.length = 0;
        angelMinionBolts.length = 0;
        bossAoes.length = 0;
        enemies.length = 0;
        player.x = 120;
        player.y = config.groundY - config.playerHeight;
        player.vx = 0;
        player.vy = 0;
        if (isCoopMode && player2.state === 'alive') {
          player2.x = 180;
          player2.y = config.groundY - config.playerHeight;
          player2.vx = 0;
          player2.vy = 0;
        }
        this.state = 'finished';
        this.labelText = '';
        this.labelTimer = 0;
        settlementShown = true;
        if (martialMode) {
          showLevel3ClearAlreadyMaxSettlement();
        } else if (gunnerMode) {
          showMartialFinaleSettlement();
        } else if (roninMode) {
          showGunnerFinaleSettlement();
        } else if (thorMode) {
          showRoninFinaleSettlement();
        } else if (demonMode) {
          showThorFinaleSettlement();
        } else if (angelMode) {
          showDemonFinaleSettlement();
        } else if (berserkerMode) {
          showAngelFinaleSettlement();
        } else {
          showBerserkerFinaleSettlement();
        }
        return;
      }

      const stage = currentStages[this.index];
      this.state = 'running';
      this.labelText = stage.label;
      this.labelTimer = this.labelDuration;

      for (const e of stage.enemies) {
        spawnEnemy(e.type, e.x, e.y);
      }
      const stageHasBoss = stage.enemies.some((e) => e.type === 'boss');
      if (stageHasBoss) {
        bossIntroDarkTimer = 0.5;
        bossIntroLabelTimer = 2.2;
        lightningFlashRemain = 0.12;
        screenShake(350);
      }
    },

    startTransition() {
      if (this.state !== 'running') return;
      this.state = 'transition';
      this.transitionTimer = 1.5;
    },

    update(dt) {
      if (this.state === 'versus') return;
      if (this.labelTimer > 0) {
        this.labelTimer -= dt;
        if (this.labelTimer < 0) this.labelTimer = 0;
      }

      if (this.state === 'running') {
        let hasAlive = false;
        for (const e of enemies) {
          if (e.hp > 0) {
            hasAlive = true;
            break;
          }
        }
        if (!hasAlive) {
          this.startTransition();
        }
      } else if (this.state === 'transition') {
        this.transitionTimer -= dt;
        if (this.transitionTimer <= 0) {
          this.transitionTimer = 0;
          this.gotoNextStage();
        }
      }
    },

    getLabelAlpha() {
      if (this.labelTimer <= 0) return 0;
      const p = this.labelTimer / this.labelDuration;
      return Math.min(1, p * 2);
    },
  };

  function getEndlessVisualSection() {
    const idx = StageController.index;
    if (idx < 0 || idx >= currentStages.length) return 1;
    const st = currentStages[idx];
    return st && st.endlessSection ? st.endlessSection : 1;
  }

  /** 兼容旧调用：仍用无尽总表，从「原第二关第一波」起打 */
  function startCampaignLevel2() {
    projectiles.length = 0;
    angelMinionBolts.length = 0;
    bossAoes.length = 0;
    enemies.length = 0;
    player.x = config.playerStartX;
    player.vx = 0;
    currentCampaignLevel = 2;
    currentStages = endlessStages;
    StageController.index = level1Stages.length - 1;
    StageController.state = 'idle';
    StageController.transitionTimer = 0;
    StageController.labelText = '';
    StageController.labelTimer = 0;
    StageController.gotoNextStage();
  }

  /** 兼容旧调用：无尽总表，从「原第三关第一波」起打 */
  function startCampaignLevel3() {
    projectiles.length = 0;
    angelMinionBolts.length = 0;
    bossAoes.length = 0;
    enemies.length = 0;
    player.x = config.playerStartX;
    player.vx = 0;
    currentCampaignLevel = 3;
    currentStages = endlessStages;
    StageController.index = level1Stages.length + level2Stages.length - 1;
    StageController.state = 'idle';
    StageController.transitionTimer = 0;
    StageController.labelText = '';
    StageController.labelTimer = 0;
    StageController.gotoNextStage();
  }

  /** 隐藏：立即进入第三关第 4 波（普通小怪波），用于测试 */
  function jumpToLevel3FinalWaveHidden() {
    settlementShown = false;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    postL2ChoiceActive = false;
    gameOverTriggered = false;
    if (settlementOverlay) settlementOverlay.classList.add('hidden');
    setPostLevel2RowVisible(false);
    const rb = document.getElementById('settlement-retry');
    if (rb) rb.classList.remove('hidden');
    gameState = 'playing';

    enemies.length = 0;
    projectiles.length = 0;
    angelMinionBolts.length = 0;
    bossAoes.length = 0;
    comboNameEffects.length = 0;
    player.x = config.playerStartX;
    player.vx = 0;
    player.vy = 0;

    afterLevel1CheckpointAccepted = true;
    currentCampaignLevel = 3;
    currentStages = endlessStages;
    StageController.index =
      level1Stages.length + level2Stages.length + level3Stages.length - 2;
    StageController.state = 'idle';
    StageController.transitionTimer = 0;
    StageController.labelText = '';
    StageController.labelTimer = 0;
    StageController.gotoNextStage();

    startAmbientLoop();
    void BGM.start();
  }

  // ========== 结算 / GameOver 系统 ==========
  let settlementShown = false;
  let gameOverTriggered = false;
  /** 为 true 表示已通过第一关第三波后的中间结算，正在或已完成第二关 */
  let afterLevel1CheckpointAccepted = false;

  function applySettlementStatsAndGrade() {
    const clearTimeMs = Math.max(0, performance.now() - stats.gameStartTime);
    const clearTimeSec = Math.floor(clearTimeMs / 1000);
    const survivalScore = clearTimeSec * 3;
    const mm = Math.floor(clearTimeSec / 60);
    const ss = String(clearTimeSec % 60).padStart(2, '0');
    statTimeEl.textContent = `${mm}:${ss}`;
    statHitsEl.textContent = String(stats.hitCount);
    statComboEl.textContent = String(survivalScore);

    if (gradeEl) {
      gradeEl.textContent = String(survivalScore);
      gradeEl.className = 'settlement-grade s';
    }
  }

  /** 第一关第三波结束：展示本关统计，不播通关曲，静音关卡 BGM，询问是否进第二关 */
  function showLevel1CheckpointSettlement() {
    postL2ChoiceActive = false;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    martialFinaleActive = false;
    setPostLevel2RowVisible(false);
    BGM.cutGameplayMusicNow();
    stopSettlementScreenMusic();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_l1_title');
    applySettlementStatsAndGrade();
    buffEl.textContent = isCoopMode ? tr('settle_l1_buff_coop') : tr('settle_l1_buff');
    buffEl.classList.remove('hidden');
    if (retryBtn) {
      retryBtn.textContent = tr('btn_next_stage');
      retryBtn.classList.remove('hidden');
    }
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第二关全通：不播音乐，仅「重新开始 / 进入下一关」两个按钮（绝不显示主按钮「进入第二关」） */
  function showPostLevel2Choice() {
    postL2ChoiceActive = true;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    BGM.cutGameplayMusicNow();
    stopSettlementScreenMusic();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_l2_title');
    applySettlementStatsAndGrade();
    buffEl.textContent = isCoopMode ? tr('settle_l2_buff_coop') : tr('settle_l2_buff');
    buffEl.classList.remove('hidden');
    const rb = document.getElementById('settlement-retry');
    if (rb) {
      rb.textContent = tr('btn_retry');
      rb.classList.add('hidden');
    }
    if (postLevel2Row) postLevel2Row.classList.remove('hidden');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第四次全通（已魔神）：雷神位格，魔神之上全属性再×2 */
  function showThorFinaleSettlement() {
    postL2ChoiceActive = false;
    thorFinaleActive = true;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    if (!berserkerMode) berserkerMode = true;
    if (!angelMode) angelMode = true;
    if (!demonMode) demonMode = true;
    thorMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_thor_title');
    gradeEl.textContent = tr('settle_thor_grade');
    gradeEl.className = 'settlement-grade s';
    buffEl.textContent = tr('settle_thor_buff') + (isCoopMode ? tr('settle_thor_buff_coop') : '');
    buffEl.classList.remove('hidden');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 已满阶时再通第三关：不升位，仅结算与再来一波 */
  function showLevel3ClearAlreadyMaxSettlement() {
    postL2ChoiceActive = false;
    level3MaxTierClearActive = true;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    gunnerFinaleActive = false;
    martialFinaleActive = false;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) {
      settlementTitleEl.textContent = martialMode ? tr('settle_martial_title') : (gunnerMode ? tr('settle_gunner_title') : tr('settle_l3_title'));
    }
    gradeEl.textContent = martialMode ? tr('settle_martial_grade') : (gunnerMode ? tr('settle_gunner_grade') : tr('settle_l3_grade'));
    gradeEl.className = 'settlement-grade s';
    buffEl.textContent = (martialMode ? tr('settle_martial_buff') : (gunnerMode ? tr('settle_gunner_buff') : tr('settle_l3_buff'))) +
      (isCoopMode ? (martialMode ? tr('settle_martial_buff_coop') : (gunnerMode ? tr('settle_gunner_buff_coop') : tr('settle_l3_buff_coop'))) : '');
    buffEl.classList.remove('hidden');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第七次全通（已冥焰枪客）：武林高手；狂暴时 J 追加降龙十八掌 */
  function showMartialFinaleSettlement() {
    postL2ChoiceActive = false;
    level3MaxTierClearActive = false;
    martialFinaleActive = true;
    gunnerFinaleActive = false;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    if (!berserkerMode) berserkerMode = true;
    if (!angelMode) angelMode = true;
    if (!demonMode) demonMode = true;
    if (!thorMode) thorMode = true;
    if (!roninMode) roninMode = true;
    if (!gunnerMode) gunnerMode = true;
    martialMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_martial_title');
    gradeEl.textContent = tr('settle_martial_grade');
    gradeEl.className = 'settlement-grade s';
    buffEl.textContent = tr('settle_martial_buff') + (isCoopMode ? tr('settle_martial_buff_coop') : '');
    buffEl.classList.remove('hidden');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第六次全通（已流浪剑客）：冥焰枪客；按住鼠标/触控连射，四发必倒 */
  function showGunnerFinaleSettlement() {
    postL2ChoiceActive = false;
    level3MaxTierClearActive = false;
    gunnerFinaleActive = true;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    if (!berserkerMode) berserkerMode = true;
    if (!angelMode) angelMode = true;
    if (!demonMode) demonMode = true;
    if (!thorMode) thorMode = true;
    if (!roninMode) roninMode = true;
    gunnerMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_gunner_title');
    gradeEl.textContent = tr('settle_gunner_grade');
    gradeEl.className = 'settlement-grade s';
    buffEl.textContent = tr('settle_gunner_buff') + (isCoopMode ? tr('settle_gunner_buff_coop') : '');
    buffEl.classList.remove('hidden');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第五次全通（已雷神）：流浪剑客位格；G 为狂暴，狂暴下每次 J 出手即发银色剑气 */
  function showRoninFinaleSettlement() {
    postL2ChoiceActive = false;
    level3MaxTierClearActive = false;
    roninFinaleActive = true;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    gunnerFinaleActive = false;
    if (!berserkerMode) berserkerMode = true;
    if (!angelMode) angelMode = true;
    if (!demonMode) demonMode = true;
    if (!thorMode) thorMode = true;
    roninMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_ronin_title');
    gradeEl.textContent = tr('settle_ronin_grade');
    gradeEl.className = 'settlement-grade s';
    buffEl.textContent = tr('settle_ronin_buff') + (isCoopMode ? tr('settle_ronin_buff_coop') : '');
    buffEl.classList.remove('hidden');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第三次全通（已持有天使）：魔鬼药水 → 魔神（天使之上全属性×2） */
  function showDemonFinaleSettlement() {
    postL2ChoiceActive = false;
    demonFinaleActive = true;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    if (!berserkerMode) berserkerMode = true;
    if (!angelMode) angelMode = true;
    demonMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_demon_title');
    gradeEl.textContent = tr('settle_demon_grade');
    gradeEl.className = 'settlement-grade s';
    if (isCoopMode) {
      buffEl.textContent = tr('settle_demon_buff_coop');
      buffEl.classList.remove('hidden');
    } else {
      buffEl.textContent = '';
      buffEl.classList.add('hidden');
    }
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第三关再次全通（已持有狂战士）：天使药水，在狂战士基础上再叠一层属性 */
  function showAngelFinaleSettlement() {
    postL2ChoiceActive = false;
    angelFinaleActive = true;
    berserkerFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    if (!berserkerMode) berserkerMode = true;
    angelMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_angel_title');
    gradeEl.textContent = tr('settle_angel_grade');
    gradeEl.className = 'settlement-grade s';
    if (isCoopMode) {
      buffEl.textContent = tr('settle_angel_buff_coop');
      buffEl.classList.remove('hidden');
    } else {
      buffEl.textContent = '';
      buffEl.classList.add('hidden');
    }
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  /** 第三关首次全通：立刻停关卡 BGM，播放 Funk/结算曲；冻结游戏，狂战士加成，仅「再来一波」 */
  function showBerserkerFinaleSettlement() {
    postL2ChoiceActive = false;
    berserkerFinaleActive = true;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    berserkerMode = true;
    stopSettlementScreenMusic();
    BGM.cutGameplayMusicNow();
    void playSettlementScreenMusic();
    setPostLevel2RowVisible(false);
    if (retryBtn) {
      retryBtn.textContent = tr('btn_wave_again');
      retryBtn.classList.remove('hidden');
    }
    syncPlayerHpCapAndFill();
    applySettlementStatsAndGrade();
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_berserk_title');
    gradeEl.textContent = tr('settle_berserk_grade');
    gradeEl.className = 'settlement-grade s';
    if (isCoopMode) {
      buffEl.textContent = tr('settle_berserk_buff_coop');
      buffEl.classList.remove('hidden');
    } else {
      buffEl.textContent = '';
      buffEl.classList.add('hidden');
    }
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
  }

  function triggerGameOver(reason) {
    if (gameOverTriggered) return;
    gameOverTriggered = true;

    postL2ChoiceActive = false;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    setPostLevel2RowVisible(false);
    const rbGo = document.getElementById('settlement-retry');
    if (rbGo) rbGo.classList.remove('hidden');

    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_defeat_title');
    applySettlementStatsAndGrade();
    if (gradeEl) gradeEl.className = 'settlement-grade dead';
    if (buffEl) {
      buffEl.textContent = '';
      buffEl.classList.add('hidden');
    }
    if (retryBtn) retryBtn.textContent = tr('btn_retry');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'settlement';
    settlementOverlay.classList.remove('hidden');
    void playSettlementScreenMusic();
  }

  function respawnVersusFighters() {
    const margin = 130;
    const groundY = config.groundY - config.playerHeight;
    player.state = 'alive';
    player.hp = player.maxHp;
    player.x = margin;
    player.y = groundY;
    player.vx = 0;
    player.vy = 0;
    player.facing = 1;
    player.onGround = true;
    player.attackStart = 0;
    player.attackCooldownEnd = 0;
    player.currentAttackId += 1;
    player.coopFriendlyLastHitAttackId = -1;
    player.isSuperAttacking = false;
    player.superAttackTimer = 0;
    player.superAttackCooldown = 0;
    player.isDodging = false;
    player.dodgeTimer = 0;
    player.dodgeCooldown = 0;
    player.isBlocking = false;
    player.knockbackEnd = 0;
    player.combo = 0;
    player.comboStep = 0;
    player.comboTimer = 0;
    player.comboActiveStep = 0;
    player.comboNextDeadline = 0;
    player.blockFlashTimer = 0;
    player.blockShakeTimer = 0;
    player.shieldGoldTimer = 0;
    player.shieldPulseActive = false;
    player.shieldPulseAge = 0;
    player.blockLastPressTime = -1e9;
    player2.state = 'alive';
    player2.hp = player2.maxHp;
    player2.x = config.width - margin - config.playerWidth;
    player2.y = groundY;
    player2.vx = 0;
    player2.vy = 0;
    player2.facing = -1;
    player2.onGround = true;
    player2.attackStart = 0;
    player2.attackCooldownEnd = 0;
    player2.currentAttackId += 1;
    player2.coopFriendlyLastHitAttackId = -1;
    player2.isSuperAttacking = false;
    player2.superAttackTimer = 0;
    player2.superAttackCooldown = 0;
    player2.isDodging = false;
    player2.dodgeTimer = 0;
    player2.dodgeCooldown = 0;
    player2.isBlocking = false;
    player2.knockbackEnd = 0;
    player2.combo = 0;
    player2.comboStep = 0;
    player2.comboTimer = 0;
    player2.comboActiveStep = 0;
    player2.comboNextDeadline = 0;
    player2.blockFlashTimer = 0;
    player2.blockShakeTimer = 0;
    player2.shieldGoldTimer = 0;
    player2.shieldPulseActive = false;
    player2.shieldPulseAge = 0;
    player2.blockLastPressTime = -1e9;
    deathDarkTimer = 0;
    gameOverTriggered = false;
    slowMotionTimer = 0;
    slowMotionScale = 1;
    slowMotionImpact = null;
  }

  function tickVersusMatch(dt) {
    if (!isVersusMode) return;
    if (versusPhase === 'match_end') return;

    if (versusPhase === 'intermission') {
      versusIntermissionTimer -= dt;
      if (versusIntermissionTimer <= 0) {
        if (versusRoundsCompleted >= 5) {
          versusPhase = 'match_end';
        } else {
          respawnVersusFighters();
          versusPhase = 'fighting';
          versusRoundArmed = true;
        }
      }
      return;
    }

    if (versusPhase !== 'fighting' || !versusRoundArmed) return;
    const p1d = player.state === 'dead';
    const p2d = player2.state === 'dead';
    if (!p1d && !p2d) return;
    versusRoundArmed = false;
    if (p1d && p2d) {
      versusBannerKey = 'versus_round_draw';
      versusPhase = 'intermission';
      versusIntermissionTimer = 2.5;
      return;
    }
    if (p1d) versusWinsP2 += 1;
    else versusWinsP1 += 1;
    versusRoundsCompleted += 1;
    versusBannerKey = p1d ? 'versus_round_win_p2' : 'versus_round_win_p1';
    versusPhase = 'intermission';
    versusIntermissionTimer = 2.8;
  }

  function resetGame(options = {}) {
    const versusArena = options.versusArena === true;
    const keepBerserker = options.keepBerserker === true;
    const keepAngel = options.keepAngel === true;
    const keepDemon = options.keepDemon === true;
    const keepThor = options.keepThor === true;
    const keepRonin = options.keepRonin === true;
    const keepGunner = options.keepGunner === true;
    const keepMartial = options.keepMartial === true;
    const keepStarter = options.keepStarter === true;
    const preserveEndlessStack =
      keepBerserker ||
      keepAngel ||
      keepDemon ||
      keepThor ||
      keepRonin ||
      keepGunner ||
      keepMartial ||
      keepStarter;
    if (!preserveEndlessStack) {
      endlessCombatStack = 0;
    }
    if (!versusArena) {
      isVersusMode = false;
      // Co-op 子菜单只写了 gameMode = 'coop'，必须在此同步，否则 P2 不显示
      isCoopMode = gameMode === 'coop' || gameMode === 'versus';
    }
    if (!keepBerserker) {
      berserkerMode = false;
      angelMode = false;
      demonMode = false;
      thorMode = false;
      roninMode = false;
      gunnerMode = false;
      martialMode = false;
    }
    if (!keepAngel) {
      angelMode = false;
      demonMode = false;
      thorMode = false;
      roninMode = false;
      gunnerMode = false;
      martialMode = false;
    }
    if (!keepDemon) {
      demonMode = false;
      thorMode = false;
      roninMode = false;
      gunnerMode = false;
      martialMode = false;
    }
    if (!keepThor) {
      thorMode = false;
      roninMode = false;
      gunnerMode = false;
      martialMode = false;
    }
    if (!keepRonin) {
      roninMode = false;
      gunnerMode = false;
      martialMode = false;
    }
    if (!keepGunner) {
      gunnerMode = false;
      martialMode = false;
    }
    if (!keepMartial) martialMode = false;
    if (!keepStarter) starterRunBuff = null;
    healChargesRemaining = 4;
    healChargesRemainingP2 = 4;
    playerBuffs.length = 0;

    for (const p of [player, player2]) {
      if (p.godRageActive) {
        applyBerserkerRageHp(false, p);
        p.godRageActive = false;
      }
      p.godThorMoveActive = false;
      p.godDemonFlyRemain = 0;
      p.godAngelSummonActive = false;
      p.godAngelMinions.length = 0;
    }
    angelMinionBolts.length = 0;
    thorSkillTrailParticles.length = 0;
    roninFootTrailParticles.length = 0;
    roninSwordQi.length = 0;
    playerBullets.length = 0;
    gunnerBulletTrailRemnants.length = 0;
    headshotBurstEffects.length = 0;
    gunFireEffects.length = 0;
    clearXianglongEffects();
    godSkillKeyHeld = false;
    godSkillKeyHeldP2 = false;
    godSkillPressingPointers.clear();
    godPointerIdsP1.clear();
    godPointerIdsP2.clear();

    enemies.length = 0;
    projectiles.length = 0;
    // 枪系统停用
    hitParticles.length = 0;
    bloodStains.length = 0;
    bleedEffects.length = 0;
    perfectBlockParticles.length = 0;
    dodgeAfterimages.length = 0;
    bossAoes.length = 0;
    comboNameEffects.length = 0;
    player.x = 120;
    player.y = config.groundY - config.playerHeight;
    player.vx = 0;
    player.vy = 0;
    player.attackStart = 0;
    player.attackCooldownEnd = 0;
    player.currentAttackId = 0;
    player.coopFriendlyLastHitAttackId = -1;
    player.combo = 0;
    player.comboStep = 0;
    player.comboTimer = 0;
    player.comboActiveStep = 0;
    player.comboUiStep = 0;
    player.comboUiTimer = 0;
    player.comboNextDeadline = 0;
    player.attackDurationSec = config.attackDuration / 1000;
    player.jHeldLast = false;
    player.isDodging = false;
    player.dodgeTimer = 0;
    player.dodgeCooldown = 0;
    player.dodgeTriggerCount = 0;
    player.dodgeHoldRepeat = 0;
    player.dodgeDir = player.facing || 1;
    player.knockbackEnd = 0;
    player.gunnerShootCd = 0;
    player.gunnerShootOnlyAnim = false;
    player.gunnerAimAngle = defaultGunnerAimAngle(player);
    player.isBlocking = false;
    player.blockFlashTimer = 0;
    player.blockShakeTimer = 0;
    player.shieldGoldTimer = 0;
    player.shieldPulseTimer = 0;
    player.shieldPulseAge = 0;
    player.shieldPulseActive = false;
    player.blockStartTime = 0;
    player.blockLastPressTime = -1e9;
    player.shiftHeldLast = false;
    player.blockHeldLast = false;
    player2.x = 180;
    player2.y = config.groundY - config.playerHeight;
    player2.vx = 0;
    player2.vy = 0;
    player2.hp = config.playerMaxHp;
    player2.maxHp = config.playerMaxHp;
    player2.facing = 1;
    player2.state = 'alive';
    player2.onGround = true;
    player2.isBlocking = false;
    player2.knockbackEnd = 0;
    player2.gunnerShootCd = 0;
    player2.gunnerShootOnlyAnim = false;
    player2.gunnerAimAngle = defaultGunnerAimAngle(player2);
    player2.blockFlashTimer = 0;
    player2.blockShakeTimer = 0;
    player2.shieldGoldTimer = 0;
    player2.shieldPulseTimer = 0;
    player2.shieldPulseAge = 0;
    player2.shieldPulseActive = false;
    player2.blockStartTime = 0;
    player2.blockLastPressTime = -1e9;
    player2.blockHeldLast = false;
    player2.isDodging = false;
    player2.dodgeTimer = 0;
    player2.dodgeCooldown = 0;
    player2.dodgeTriggerCount = 0;
    player2.dodgeDir = player2.facing || 1;
    player2.dodgeTrailTimer = 0;
    player2.attackStart = 0;
    player2.attackDurationSec = config.attackDuration / 1000;
    player2.attackCooldownEnd = 0;
    player2.currentAttackId = 0;
    player2.coopFriendlyLastHitAttackId = -1;
    player2.isSuperAttacking = false;
    player2.superAttackFrame = 0;
    player2.superAttackTimer = 0;
    player2.superAttackCooldown = 0;
    player2.combo = 0;
    player2.comboStep = 0;
    player2.comboTimer = 0;
    player2.comboActiveStep = 0;
    player2.comboUiStep = 0;
    player2.comboUiTimer = 0;
    player2.comboNextDeadline = 0;
    player2.bHeldLast = false;
    shieldParticlesP2.length = 0;
    shieldSparksP2.length = 0;
    shieldParticles.length = 0;
    shieldSparks.length = 0;
    player.onGround = true;
    player.state = 'alive';
    player.anim = 'idle';
    // 拳风/慢动作终结技清理
    punchWindEffects.length = 0;
    berserkerDeathBeams.length = 0;
    slowMotionTimer = 0;
    slowMotionScale = 1;
    slowMotionImpact = null;
    slowMotionFinishIsBoss = false;
    cameraX = 0;
    shakeRemain = 0;
    shakePeakMs = 0;
    shakeAmount = config.screenShakeAmount;
    lastShakeKnockAtMs = 0;
    lightningFlashRemain = 0;
    comboFlashRemain = 0;
    hpStrategyFlashRemain = 0;
    perfectBlockFlashRemain = 0;
    bossIntroDarkTimer = 0;
    bossIntroLabelTimer = 0;
    nextLightningTime = 12;
    stats.reset();
    settlementOverlay.classList.add('hidden');
    settlementShown = false;
    gameOverTriggered = false;
    deathDarkTimer = 0;
    coopBothDeadPrev = false;
    afterLevel1CheckpointAccepted = false;
    postL2ChoiceActive = false;
    berserkerFinaleActive = false;
    angelFinaleActive = false;
    demonFinaleActive = false;
    thorFinaleActive = false;
    roninFinaleActive = false;
    martialFinaleActive = false;
    level3MaxTierClearActive = false;
    setPostLevel2RowVisible(false);
    const rbReset = document.getElementById('settlement-retry');
    if (rbReset) rbReset.classList.remove('hidden');
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
    gameState = 'playing';
    stopSettlementScreenMusic();
    void BGM.start(); // 重新加载并播放关卡循环 BGM
    awaitingNextLevel = false;
    currentStages = endlessStages;
    if (versusArena) {
      isVersusMode = true;
      isCoopMode = true;
      gameMode = 'versus';
      StageController.index = 0;
      StageController.state = 'versus';
      StageController.transitionTimer = 0;
      StageController.labelText = '';
      StageController.labelTimer = 0;
      versusWinsP1 = 0;
      versusWinsP2 = 0;
      versusRoundsCompleted = 0;
      versusPhase = 'fighting';
      versusIntermissionTimer = 0;
      versusRoundArmed = true;
      versusBannerKey = '';
      stats.gameStartTime = performance.now();
    } else {
      stats.gameStartTime = performance.now();
      StageController.index = -1;
      StageController.state = 'idle';
      StageController.transitionTimer = 0;
      StageController.labelText = '';
      StageController.labelTimer = 0;
      StageController.start();
    }
    syncPlayerHpCapAndFill();
    if (versusArena) respawnVersusFighters();
  }

  function restartFromPostL2WithStarterBuff() {
    const picks = ['hp', 'atk', 'atkspd', 'knock'];
    starterRunBuff = picks[Math.floor(Math.random() * picks.length)];
    postL2ChoiceActive = false;
    settlementShown = false;
    settlementOverlay.classList.add('hidden');
    if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
    Object.keys(keys).forEach((k) => { keys[k] = false; });
    gameState = 'playing';
    stopSettlementScreenMusic();
    resetGame({ keepStarter: true });
  }

  const retryBtn = document.getElementById('settlement-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      if (gameOverTriggered) {
        location.reload();
        return;
      }
      if (level3MaxTierClearActive) {
        level3MaxTierClearActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({
          keepBerserker: true,
          keepAngel: true,
          keepDemon: true,
          keepThor: true,
          keepRonin: true,
          keepGunner: true,
          keepMartial: true,
        });
        return;
      }
      if (martialFinaleActive) {
        martialFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({
          keepBerserker: true,
          keepAngel: true,
          keepDemon: true,
          keepThor: true,
          keepRonin: true,
          keepGunner: true,
          keepMartial: true,
        });
        return;
      }
      if (gunnerFinaleActive) {
        gunnerFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({
          keepBerserker: true,
          keepAngel: true,
          keepDemon: true,
          keepThor: true,
          keepRonin: true,
          keepGunner: true,
        });
        return;
      }
      if (roninFinaleActive) {
        roninFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({
          keepBerserker: true,
          keepAngel: true,
          keepDemon: true,
          keepThor: true,
          keepRonin: true,
        });
        return;
      }
      if (thorFinaleActive) {
        thorFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({
          keepBerserker: true,
          keepAngel: true,
          keepDemon: true,
          keepThor: true,
        });
        return;
      }
      if (demonFinaleActive) {
        demonFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({ keepBerserker: true, keepAngel: true, keepDemon: true });
        return;
      }
      if (angelFinaleActive) {
        angelFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({ keepBerserker: true, keepAngel: true });
        return;
      }
      if (berserkerFinaleActive) {
        berserkerFinaleActive = false;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        resetGame({ keepBerserker: true });
        return;
      }
      if (
        gameState === 'settlement' &&
        currentCampaignLevel === 1 &&
        StageController.state === 'finished' &&
        !afterLevel1CheckpointAccepted
      ) {
        afterLevel1CheckpointAccepted = true;
        settlementShown = false;
        settlementOverlay.classList.add('hidden');
        if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
        Object.keys(keys).forEach((k) => { keys[k] = false; });
        gameState = 'playing';
        stopSettlementScreenMusic();
        void BGM.start();
        startCampaignLevel2();
        return;
      }
      resetGame();
    });
  }

  if (btnRestartRun) {
    btnRestartRun.addEventListener('click', () => {
      if (gameState !== 'settlement' || !postL2ChoiceActive) return;
      restartFromPostL2WithStarterBuff();
    });
  }
  if (btnNextLevel) {
    btnNextLevel.addEventListener('click', () => {
      if (gameState !== 'settlement' || !postL2ChoiceActive) return;
      postL2ChoiceActive = false;
      settlementShown = false;
      settlementOverlay.classList.add('hidden');
      setPostLevel2RowVisible(false);
      if (settlementTitleEl) settlementTitleEl.textContent = tr('settle_result');
      Object.keys(keys).forEach((k) => { keys[k] = false; });
      gameState = 'playing';
      stopSettlementScreenMusic();
      void BGM.start();
      startCampaignLevel3();
    });
  }

  // ========== 总更新 ==========
  function update(dt) {
    if (shakeRemain > 0) {
      shakeRemain -= dt * 1000;
      if (shakeRemain <= 0) {
        shakeRemain = 0;
        shakePeakMs = 0;
        shakeAmount = config.screenShakeAmount;
      }
    }

    if (hitstopRemain > 0) {
      hitstopRemain -= dt;
      if (hitstopRemain < 0) hitstopRemain = 0;
      return;
    }

    if (gameState === 'settlement') return;

    const t = performance.now() / 1000;

    // 神迹状态按「已解锁位阶」保留：每人独立清理无效态
    const godActorsList = isCoopMode ? [player, player2] : [player];
    for (const pl of godActorsList) {
      if (!berserkerMode && pl.godRageActive) {
        applyBerserkerRageHp(false, pl);
        pl.godRageActive = false;
      }
      if (roninMode && pl.godThorMoveActive) {
        pl.godThorMoveActive = false;
      }
      if (!thorMode && pl.godThorMoveActive) {
        pl.godThorMoveActive = false;
      }
      if (!angelMode && pl.godAngelSummonActive) {
        pl.godAngelSummonActive = false;
        pl.godAngelMinions.length = 0;
      }
      if (!demonMode && pl.godDemonFlyRemain > 0) pl.godDemonFlyRemain = 0;
    }
    if (!player.godThorMoveActive && !player2.godThorMoveActive) {
      thorSkillTrailParticles.length = 0;
    }
    if (!angelMode) angelMinionBolts.length = 0;

    // 闪避残影（先画在人物后面）
    for (const a of dodgeAfterimages) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, a.alpha));
      ctx.fillStyle = 'rgba(220, 240, 255, 0.6)';
      ctx.fillRect(a.x, a.y, config.playerWidth, config.playerHeight);
      ctx.restore();
    }
    if (lightningFlashRemain > 0) lightningFlashRemain -= dt;
    if (comboFlashRemain > 0) comboFlashRemain -= dt;
    if (hpStrategyFlashRemain > 0) hpStrategyFlashRemain -= dt;
    if (perfectBlockFlashRemain > 0) perfectBlockFlashRemain -= dt;
    if (bossIntroDarkTimer > 0) bossIntroDarkTimer -= dt;
    if (bossIntroLabelTimer > 0) bossIntroLabelTimer -= dt;
    if (player.comboUiTimer > 0) {
      player.comboUiTimer -= dt;
      if (player.comboUiTimer <= 0) {
        player.comboUiTimer = 0;
        player.comboUiStep = 0;
      }
    }
    if (isCoopMode && player2.comboUiTimer > 0) {
      player2.comboUiTimer -= dt;
      if (player2.comboUiTimer <= 0) {
        player2.comboUiTimer = 0;
        player2.comboUiStep = 0;
      }
    }

    // 先更新玩家，再决定状态/动画
    updatePlayer(dt, t);
    updatePlayer2(dt, t);
    updateAngelMinions(dt, t);
    updateAngelMinionBolts(dt, t);
    updateThorSkillTrail(dt, t);
    updateRoninSwordQi(dt, t);
    updateXianglongDragonPalms(dt, t);
    updateRoninFootTrail(dt, t);
    updateGunnerShooting(dt, t);
    updatePlayerBullets(dt, t);
    updateHeadshotBursts(dt);
    syncPlayerAnimAction(t);

    if (player.hp <= 0 && player.state !== 'dead') {
      player.hp = 0;
      player.state = 'dead';
      player.anim = 'idle';
      deathDarkTimer = 0;               // 从 0 开始计时暗屏
      if (deathSprite) deathSprite.playOnce(); // 等价于 deathAnim.reset(false)
      // 慢动作击杀技：玩家死亡立即取消
      if (slowMotionTimer > 0) {
        slowMotionTimer = 0;
        slowMotionScale = 1;
        slowMotionImpact = null;
        slowMotionFinishIsBoss = false;
      }
    }

    const coopBothDead =
      isCoopMode && player.state === 'dead' && player2.state === 'dead';
    if (coopBothDead && !coopBothDeadPrev) {
      deathDarkTimer = 0;
    }
    coopBothDeadPrev = coopBothDead;

    if (player.state === 'dead') {
      if (deathSprite && deathSprite.img) deathSprite.update(dt);
      const runDeathSequenceTimer = !isCoopMode || coopBothDead;
      if (runDeathSequenceTimer) {
        deathDarkTimer += dt;
        if (deathDarkTimer >= 4 && !gameOverTriggered) {
          triggerGameOver('dead');
        }
      }
    } else {
      const inAttack = player.attackStart > 0 && t - player.attackStart < (player.attackDurationSec || config.attackDuration / 1000);
      if (inAttack) {
        player.anim = 'attack';
      } else if (Math.abs(player.vx) > 0.1) {
        player.anim = 'run';
      } else {
        player.anim = 'idle';
      }

      if (player.hp > 0) {
        if (player.anim === 'attack' && punchSprite && punchSprite.img) punchSprite.update(dt);
        else if (player.anim === 'run' && runSprite && runSprite.img) runSprite.update(dt);
        else if (player.anim === 'idle' && idleSprite && idleSprite.img) idleSprite.update(dt);
      }
    }
    if (isCoopMode && player2.state === 'alive' && player2.hp > 0) {
      if (player2.anim === 'attack' && punchSpriteP2 && punchSpriteP2.img) punchSpriteP2.update(dt);
      else if (player2.anim === 'run' && runSpriteP2 && runSpriteP2.img) runSpriteP2.update(dt);
      else if (player2.anim === 'idle' && idleSpriteP2 && idleSpriteP2.img) idleSpriteP2.update(dt);
    }
    if (playerAnim) playerAnim.update(dt);
    updateEnemies(dt, t);
    resolveEnemyOverlap();
    resolvePlayerEnemyOverlap();
    updateProjectiles(dt);
    updateHitParticles(dt);
    updateBerserkerDeathBeams(dt);
    // 招式名称浮动文字更新
    for (let i = comboNameEffects.length - 1; i >= 0; i--) {
      const n = comboNameEffects[i];
      n.life -= dt;
      if (n.life <= 0) {
        comboNameEffects.splice(i, 1);
        continue;
      }
      n.y += (n.vy || 0) * dt;
      // scale 从 1.5 快速缩小到 1.0（前0.15秒）
      const elapsed = (n.maxLife || 0) - n.life;
      if (elapsed < 0.15) {
        n.scale = 1.5 - (elapsed / 0.15) * 0.5;
        // 第3拳轻微“弹跳”回弹感（更夸张的终结段）
        if (n.step === 3) {
          const p = elapsed / 0.15; // 0..1
          n.scale += 0.08 * Math.sin(p * Math.PI);
        }
      } else {
        n.scale = 1.0;
      }
    }
    for (let i = punchWindEffects.length - 1; i >= 0; i--) {
      punchWindEffects[i].life -= dt;
      if (punchWindEffects[i].life <= 0) punchWindEffects.splice(i, 1);
    }
    // 更新完美格挡金色粒子
    for (let i = perfectBlockParticles.length - 1; i >= 0; i--) {
      const p = perfectBlockParticles[i];
      p.life -= dt;
      if (p.life <= 0) {
        perfectBlockParticles.splice(i, 1);
        continue;
      }
      // 记录拖尾（最多保留 5 个历史位置）
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();

      // 物理更新
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.rotation += p.rotSpeed * dt;
      p.size *= 0.995;
    }
    updateBloodStains(dt);
    updateBleedEffects(dt);
    updateBossAoes(dt);
    handlePlayerAttack(t);
    handlePlayer2Attack(t);
    if (isVersusMode) {
      if (player.hp <= 0 && player.state !== 'dead') {
        player.hp = 0;
        player.state = 'dead';
        player.anim = 'idle';
        deathDarkTimer = 0;
        if (deathSprite) deathSprite.playOnce();
        if (slowMotionTimer > 0) {
          slowMotionTimer = 0;
          slowMotionScale = 1;
          slowMotionImpact = null;
          slowMotionFinishIsBoss = false;
        }
      }
      if (player2.hp <= 0 && player2.state !== 'dead') {
        player2.hp = 0;
        player2.state = 'dead';
        player2.anim = 'idle';
        if (deathSpriteP2) deathSpriteP2.playOnce();
      }
      tickVersusMatch(dt);
    }
    StageController.update(dt);
    BGM.update(dt, t, Math.max(0, StageController.index));

    const px =
      isCoopMode && player.state !== 'alive' && player2.state === 'alive'
        ? player2.x + config.playerWidth / 2
        : player.x + config.playerWidth / 2;
    for (const e of enemies) {
      if (e.hp <= 0 || e.isBoss) continue;
      if (e.type !== 'melee' && e.type !== 'elite') continue;
      const ex = e.x + e.width / 2;
      if (Math.abs(ex - px) < 150) {
        if (!e.lastGrowlTime || t - e.lastGrowlTime > 2.2) {
          playZombieGrowl();
          e.lastGrowlTime = t;
        }
        break;
      }
    }

    let camFollowX = player.x;
    if (isCoopMode) {
      if (player.state === 'alive') camFollowX = player.x;
      else if (player2.state === 'alive') camFollowX = player2.x;
      else camFollowX = player.x;
    }
    const camTarget = camFollowX - config.playerStartX;
    cameraX += (camTarget - cameraX) * Math.min(1, config.cameraLerpSpeed * dt);

    if (lightningFlashRemain <= 0 && t >= nextLightningTime) {
      lightningFlashRemain = 0.1;
      nextLightningTime = t + 8 + Math.random() * 12;
    }

    // UI：血条固定显示 P1 / P2（不再显示敌人总血）
    playerHpBar.style.width = (100 * (player.hp / player.maxHp)) + '%';
    if (isCoopMode) enemyHpBar.style.width = (100 * (player2.hp / player2.maxHp)) + '%';
    else enemyHpBar.style.width = '0%';
    enemyHpBar.closest('.bar-wrap').classList.remove('is-boss');
  }

  // ========== 视差背景（暗黑僵尸风格） ==========
  function drawParallaxBackground() {
    const gw = config.width;
    const gh = config.height;
    const gy = config.groundY;

    // 1) 铺满背景图（第二关用 sceneBgLevel2）
    const parallaxBg =
      getEndlessVisualSection() >= 2 && sceneBgLevel2.complete && sceneBgLevel2.naturalWidth > 0
        ? sceneBgLevel2
        : sceneBg;
    if (parallaxBg && parallaxBg.complete && parallaxBg.naturalWidth > 0 && parallaxBg.naturalHeight > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      const iw = parallaxBg.naturalWidth;
      const ih = parallaxBg.naturalHeight;
      const scale = Math.max(gw / iw, gh / ih); // cover
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = Math.floor((gw - dw) / 2);
      // 让图片尽量“贴地”：底边对齐 groundY，方便角色脚下看起来贴合
      const dy = Math.floor(gy - dh);
      ctx.drawImage(parallaxBg, dx, dy, dw, dh);
      ctx.restore();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, gw, gh);
    }

    // 2) 脚下一根黑线 + 泥土（不随镜头移动）
    const lineY = Math.floor(gy) + 0.5;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, lineY, gw, 1);

    const dirtTop = Math.floor(gy) + 1;
    const px = 6;
    const shades = ['#2b1f16', '#3a2a1f', '#251a12', '#402f22'];
    const rock = '#1a110c';
    for (let y = dirtTop; y < gh; y += px) {
      for (let x = -20; x < gw + 20; x += px) {
        const v = Math.abs((x * 13 + y * 17) % 17);
        const isRock = v === 0 || v === 1 || v === 2;
        const idx = v % shades.length;
        ctx.fillStyle = isRock ? rock : shades[idx];
        ctx.fillRect(x, y, px, px);
      }
    }
  }

  /** 天使降临：左女右男 PNG；女朝左、男朝右为默认，再按 facing 翻转朝向敌人；图中人物略放大 */
  function drawAngelMinionSprite(ctx, m, t) {
    const isFemale = m.side < 0;
    const img = isFemale ? angelFlyFemaleSprite : angelFlyMaleSprite;
    const bob = Math.sin(t * 2.7 + m.side * 1.4) * 4;
    if (!img || !img.complete || img.naturalWidth <= 0) {
      drawAngelMinionPixelSprite(ctx, m, t);
      return;
    }
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const fit = Math.min(m.w / iw, m.h / ih);
    const scale = fit * 1.18;
    const dw = iw * scale;
    const dh = ih * scale;
    const cx = m.x + m.w / 2;
    const cy = m.y + m.h / 2 + bob;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(cx, cy);
    const flipX = isFemale ? m.facing > 0 : m.facing < 0;
    if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, iw, ih, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  /** 天使降临：金色像素风后备绘制（精灵未加载时） */
  function drawAngelMinionPixelSprite(ctx, m, t) {
    const cw = 8;
    const ch = 14;
    const psx = m.w / cw;
    const psy = m.h / ch;
    const x0 = Math.floor(m.x);
    const y0 = Math.floor(m.y);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(x0, y0);
    if (m.facing < 0) {
      ctx.translate(m.w, 0);
      ctx.scale(-1, 1);
    }
    const R = (gx, gy, gw, gh, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(gx * psx, gy * psy, gw * psx, gh * psy);
    };
    const O = '#5c430a';
    const D = '#9a7209';
    const G = '#e6b321';
    const M = '#f2ca3a';
    const H = '#fff8d6';
    R(3, 0, 2, 1, O);
    R(2, 1, 4, 1, O);
    R(2, 2, 4, 3, M);
    R(3, 3, 2, 1, H);
    R(3, 4, 1, 1, '#3d2f1c');
    R(5, 4, 1, 1, '#3d2f1c');
    R(2, 5, 4, 1, O);
    R(2, 6, 4, 4, G);
    R(3, 7, 2, 2, M);
    R(1, 7, 1, 2, D);
    R(6, 7, 1, 2, D);
    R(0, 8, 1, 1, O);
    R(7, 8, 1, 1, O);
    R(2, 10, 4, 2, M);
    R(2, 12, 2, 2, D);
    R(4, 12, 2, 2, D);
    R(1, 13, 2, 1, O);
    R(5, 13, 2, 1, O);
    const glow = 0.35 + Math.sin(t * 8 + m.side) * 0.12;
    ctx.globalAlpha = glow;
    ctx.fillStyle = 'rgba(255, 230, 120, 0.45)';
    ctx.fillRect(0, 0, m.w, Math.max(4, m.h * 0.12));
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /** 左下神技条 + 右下 闪/J/L/K 的点击区域（与绘制一致） */
  function getGameplayHudRects() {
    const pad = 14;
    const btn = 52;
    const gap = 10;
    const bottom = config.height - pad;
    const k = { x: config.width - pad - btn, y: bottom - btn, w: btn, h: btn };
    const l = { x: k.x - gap - btn, y: k.y, w: btn, h: btn };
    const j = { x: l.x - gap - btn, y: k.y, w: btn, h: btn };
    const dodge = { x: j.x - gap - btn, y: k.y, w: btn, h: btn };
    const gw = Math.max(96, Math.min(248, dodge.x - pad * 2 - 12));
    const gh = 48;
    const god = { x: pad, y: bottom - gh, w: gw, h: gh };
    return { god, dodge, j, l, k };
  }

  function hudFillRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawHudActionButton(ctx, rect, opts) {
    const { main, sub, ready, accent, base } = opts;
    const rr = 12;
    ctx.save();
    hudFillRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, rr);
    const g = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
    if (base === 'cyan') {
      g.addColorStop(0, ready ? '#1e3a5f' : '#152436');
      g.addColorStop(1, '#0a121f');
    } else if (base === 'amber') {
      g.addColorStop(0, ready ? '#5c3d0a' : '#3d2908');
      g.addColorStop(1, '#1a1206');
    } else if (base === 'violet') {
      g.addColorStop(0, '#3d2a5c');
      g.addColorStop(1, '#151022');
    } else {
      g.addColorStop(0, '#2d3748');
      g.addColorStop(1, '#11151f');
    }
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = ready ? accent : 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(main, rect.x + rect.w / 2, rect.y + rect.h / 2 + (sub ? -3 : 7));
    if (sub) {
      ctx.font = '600 10px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(186, 200, 220, 0.92)';
      ctx.fillText(sub, rect.x + rect.w / 2, rect.y + rect.h / 2 + 13);
    }
    ctx.textAlign = 'left';
    ctx.restore();
  }

  /** 神阶头顶光环（P1/P2 共用逻辑，与全局 ronin/thor/demon/angel/berserker 状态一致） */
  function drawGodTierHaloAboveActor(ctx, p, t) {
    if (!p || p.state !== 'alive') return;
    const hx0 = p.x + config.playerWidth / 2;
    if (martialMode && berserkerMode) {
      const hx = hx0;
      const hy = p.y - 13 + Math.sin(t * 3.1) * 2.4;
      const rx = 38 + Math.sin(t * 3.7) * 3.2;
      const ry = 10 + Math.sin(t * 3.7) * 1.4;
      ctx.save();
      const pulse = 0.84 + Math.sin(t * 4.8) * 0.1;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 4, 0, hx, hy + 4, rx + 24);
      glow.addColorStop(0, 'rgba(255, 255, 220, 0.58)');
      glow.addColorStop(0.26, 'rgba(252, 211, 77, 0.48)');
      glow.addColorStop(0.55, 'rgba(34, 211, 238, 0.3)');
      glow.addColorStop(1, 'rgba(8, 47, 73, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 14, ry + 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(253, 224, 71, ${0.96 * pulse})`;
      ctx.lineWidth = 3.4;
      ctx.shadowColor = 'rgba(103, 232, 249, 0.95)';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(103, 232, 249, ${0.82 * pulse})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.88, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 18; i++) {
        const phase = t * 3.4 + i * 0.56;
        const ra = rx + 8 + (i % 6) * 3.1;
        const px = hx + Math.cos(phase) * ra;
        const py = hy + Math.sin(phase * 1.08) * (ry + 7);
        const sz = 2.2 + (i % 5) * 0.9;
        ctx.globalAlpha = (0.45 + 0.45 * (0.5 + 0.5 * Math.sin(phase * 2.6 + i))) * pulse;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(253, 230, 138, 0.98)' : 'rgba(103, 232, 249, 0.96)';
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
      ctx.restore();
    } else if (gunnerMode && berserkerMode) {
      const hx = hx0;
      const hy = p.y - 12 + Math.sin(t * 2.9) * 2.2;
      const rx = 36 + Math.sin(t * 3.4) * 3;
      const ry = 10 + Math.sin(t * 3.4) * 1.3;
      ctx.save();
      const pulse = 0.8 + Math.sin(t * 4.2) * 0.1;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 4, 0, hx, hy + 3, rx + 22);
      glow.addColorStop(0, 'rgba(255, 60, 60, 0.55)');
      glow.addColorStop(0.25, 'rgba(180, 20, 30, 0.45)');
      glow.addColorStop(0.55, 'rgba(40, 8, 12, 0.38)');
      glow.addColorStop(1, 'rgba(8, 4, 6, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 14, ry + 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(220, 40, 50, ${0.95 * pulse})`;
      ctx.lineWidth = 3.4;
      ctx.shadowColor = 'rgba(255, 50, 60, 0.9)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(18, 8, 10, ${0.92 * pulse})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.88, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const phase = t * 3.1 + i * 0.72;
        const ra = rx + 6 + (i % 4) * 2.4;
        const px = hx + Math.cos(phase) * ra;
        const py = hy + Math.sin(phase * 1.08) * (ry + 5);
        const sz = 2 + (i % 3) * 0.9;
        const fa = 0.38 + 0.42 * (0.5 + 0.5 * Math.sin(phase * 2.6 + i));
        ctx.globalAlpha = fa * pulse;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 70, 80, 0.92)' : 'rgba(12, 6, 8, 0.95)';
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
      ctx.restore();
    } else if (roninMode && berserkerMode) {
      const hx = hx0;
      const hy = p.y - 12 + Math.sin(t * 2.7) * 2;
      const rx = 35 + Math.sin(t * 3.2) * 2.8;
      const ry = 9.5 + Math.sin(t * 3.2) * 1.25;
      ctx.save();
      const pulse = 0.78 + Math.sin(t * 3.9) * 0.1;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 4, 0, hx, hy + 3, rx + 20);
      glow.addColorStop(0, 'rgba(210, 170, 120, 0.55)');
      glow.addColorStop(0.22, 'rgba(139, 90, 43, 0.42)');
      glow.addColorStop(0.5, 'rgba(92, 58, 32, 0.28)');
      glow.addColorStop(1, 'rgba(55, 35, 18, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 12, ry + 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(120, 72, 38, ${0.94 * pulse})`;
      ctx.lineWidth = 3.2;
      ctx.shadowColor = 'rgba(160, 100, 55, 0.85)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(75, 48, 28, ${0.88 * pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.9, ry * 0.82, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 14; i++) {
        const phase = t * 2.9 + i * 0.62;
        const ra = rx + 8 + (i % 5) * 2.6;
        const px = hx + Math.cos(phase) * ra;
        const py = hy + Math.sin(phase * 1.05) * (ry + 6);
        const sz = 2 + (i % 4) * 0.85;
        const fa = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(phase * 2.8 + i));
        ctx.globalAlpha = fa * pulse;
        ctx.fillStyle =
          i % 3 === 0 ? 'rgba(255, 235, 200, 0.9)' : 'rgba(101, 67, 33, 0.95)';
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
      ctx.restore();
    } else if (thorMode && berserkerMode && !roninMode && !gunnerMode) {
      const hx = hx0;
      const hy = p.y - 13 + Math.sin(t * 3.2) * 2;
      const rx = 36 + Math.sin(t * 3.4) * 3;
      const ry = 10 + Math.sin(t * 3.4) * 1.4;
      ctx.save();
      const pulse = 0.82 + Math.sin(t * 5) * 0.1;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 5, 0, hx, hy + 4, rx + 22);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      glow.addColorStop(0.2, 'rgba(200, 240, 255, 0.35)');
      glow.addColorStop(0.5, 'rgba(80, 180, 255, 0.22)');
      glow.addColorStop(1, 'rgba(30, 60, 120, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 14, ry + 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 250, 200, ${0.95 * pulse})`;
      ctx.lineWidth = 3.6;
      ctx.shadowColor = 'rgba(120, 200, 255, 1)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(60, 140, 255, ${0.88 * pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.88, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 18; i++) {
        const phase = t * 3.6 + i * 0.55;
        const ra = rx + 9 + (i % 6) * 3.4;
        const px = hx + Math.cos(phase) * ra;
        const py = hy + Math.sin(phase * 1.06) * (ry + 7);
        const sz = 2.4 + (i % 5) * 0.95;
        const fa = 0.55 + 0.4 * (0.5 + 0.5 * Math.sin(phase * 3.5 + i));
        ctx.globalAlpha = Math.min(1, fa * pulse);
        ctx.fillStyle =
          i % 4 === 0 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(120, 210, 255, 0.96)';
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
      ctx.restore();
    } else if (demonMode && berserkerMode && !thorMode) {
      const hx = hx0;
      const hy = p.y - 11 + Math.sin(t * 2.5) * 2;
      const rx = 34 + Math.sin(t * 3.1) * 3;
      const ry = 9.5 + Math.sin(t * 3.1) * 1.3;
      ctx.save();
      const pulse = 0.82 + Math.sin(t * 3.8) * 0.12;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 4, 0, hx, hy + 4, rx + 20);
      glow.addColorStop(0, 'rgba(48, 18, 98, 0.88)');
      glow.addColorStop(0.28, 'rgba(22, 6, 58, 0.78)');
      glow.addColorStop(0.55, 'rgba(10, 2, 38, 0.72)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 12, ry + 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(62, 28, 152, ${0.96 * pulse})`;
      ctx.lineWidth = 3.6;
      ctx.shadowColor = 'rgba(45, 20, 120, 0.98)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(18, 12, 32, ${0.96 * pulse})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.9, ry * 0.82, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(130, 22, 62, ${0.72 * pulse})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 1.05, ry * 0.95, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 18; i++) {
        const phase = t * 2.8 + i * 0.58;
        const ra = rx + 8 + (i % 6) * 3.2;
        const px = hx + Math.cos(phase) * ra;
        const py = hy + Math.sin(phase * 1.05) * (ry + 7);
        const sz = 2 + (i % 5) * 0.85;
        const fa = 0.52 + 0.44 * (0.5 + 0.5 * Math.sin(phase * 2.1 + i));
        ctx.globalAlpha = Math.min(1, fa * pulse);
        const dark = i % 3 === 0;
        ctx.fillStyle = dark
          ? 'rgba(160, 28, 72, 0.98)'
          : 'rgba(38, 18, 88, 0.98)';
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
      ctx.restore();
    } else if (angelMode && berserkerMode) {
      const hx = hx0;
      const hy = p.y - 12 + Math.sin(t * 2.4) * 2;
      const rx = 32 + Math.sin(t * 3) * 3;
      const ry = 9 + Math.sin(t * 3) * 1.4;
      ctx.save();
      const pulse = 0.78 + Math.sin(t * 4.2) * 0.1;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 4, 0, hx, hy + 3, rx + 18);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      glow.addColorStop(0.25, 'rgba(255, 248, 200, 0.38)');
      glow.addColorStop(0.55, 'rgba(255, 220, 120, 0.2)');
      glow.addColorStop(1, 'rgba(255, 190, 60, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 12, ry + 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 245, 180, ${0.95 * pulse})`;
      ctx.lineWidth = 3.2;
      ctx.shadowColor = 'rgba(255, 230, 140, 0.95)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.62 * pulse})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.86, ry * 0.78, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 16; i++) {
        const phase = t * 2.4 + i * 0.65;
        const ra = rx + 10 + (i % 5) * 2.8;
        const px = hx + Math.cos(phase) * ra;
        const py = hy + Math.sin(phase * 1.07) * (ry + 6);
        const sz = 2.2 + (i % 4) * 0.9;
        const fa = 0.28 + 0.42 * (0.5 + 0.5 * Math.sin(phase * 2.3 + i));
        ctx.globalAlpha = fa * pulse;
        ctx.fillStyle = 'rgba(255, 252, 220, 0.95)';
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
      ctx.restore();
    } else if (berserkerMode) {
      const hx = hx0;
      const hy = p.y - 10 + Math.sin(t * 2.6) * 2.5;
      const rx = 28 + Math.sin(t * 3.2) * 2.5;
      const ry = 8 + Math.sin(t * 3.2) * 1.2;
      const rageHalo =
        p.godRageActive && getCurrentGodSkillTier() === 'berserker';
      ctx.save();
      const pulse = 0.72 + Math.sin(t * 4) * 0.12;
      ctx.globalAlpha = pulse;
      const glow = ctx.createRadialGradient(hx, hy - 3, 0, hx, hy + 2, rx + 14);
      if (rageHalo) {
        glow.addColorStop(0, 'rgba(255, 80, 60, 0.52)');
        glow.addColorStop(0.35, 'rgba(255, 40, 30, 0.28)');
        glow.addColorStop(0.7, 'rgba(180, 20, 40, 0.12)');
        glow.addColorStop(1, 'rgba(120, 0, 20, 0)');
      } else {
        glow.addColorStop(0, 'rgba(255, 255, 245, 0.45)');
        glow.addColorStop(0.35, 'rgba(255, 215, 100, 0.22)');
        glow.addColorStop(0.7, 'rgba(255, 160, 40, 0.08)');
        glow.addColorStop(1, 'rgba(255, 120, 20, 0)');
      }
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx + 10, ry + 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rageHalo
        ? `rgba(255, 90, 70, ${0.92 * pulse})`
        : `rgba(255, 230, 140, ${0.88 * pulse})`;
      ctx.lineWidth = 2.8;
      ctx.shadowColor = rageHalo
        ? 'rgba(255, 60, 40, 0.85)'
        : 'rgba(255, 200, 80, 0.75)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = rageHalo
        ? `rgba(255, 200, 180, ${0.55 * pulse})`
        : `rgba(255, 255, 220, ${0.5 * pulse})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(hx, hy, rx * 0.88, ry * 0.82, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function updateExternalTouchSuperThumb(btn, pl) {
    if (!btn || !pl) return;
    const cv = btn.querySelector('.touch-super-canvas');
    if (!cv) return;
    const c2 = cv.getContext('2d');
    c2.imageSmoothingEnabled = false;
    c2.clearRect(0, 0, cv.width, cv.height);
    const ok =
      superAttackSprite &&
      superAttackSprite.complete &&
      superAttackSprite.naturalWidth >= pl.superAttackFrameWidth;
    btn.classList.toggle('touch-super--has-sprite', !!ok);
    if (ok) {
      c2.drawImage(
        superAttackSprite,
        0, 0,
        pl.superAttackFrameWidth, pl.superAttackFrameHeight,
        0, 0, cv.width, cv.height
      );
    }
  }

  function styleExternalGodButton(btn, tier, hasGod, sideHeld) {
    if (!btn) return;
    const owner = btn.id === 'touch-god-p2' ? player2 : player;
    const labelEl = btn.querySelector('.touch-god-label');
    const subEl = btn.querySelector('.touch-god-sub');
    const flyEl = btn.querySelector('.touch-god-fly');
    const label = getGodSkillButtonLabel();
    if (labelEl) {
      if (label.length <= 12) labelEl.textContent = label;
      else {
        const cut = Math.min(10, Math.floor(label.length / 2));
        labelEl.textContent = `${label.slice(0, cut)}\n${label.slice(cut)}`;
      }
    }
    if (subEl) {
      const isP1 = btn.id === 'touch-god-p1';
      subEl.textContent = hasGod ? (isP1 ? tr('god_tap_g') : tr('god_tap_c')) : tr('god_locked');
    }
    const demonFlyingHud = demonMode && owner.godDemonFlyRemain > 0;
    if (flyEl) {
      if (demonFlyingHud) {
        flyEl.textContent = tr('god_fly', Math.ceil(owner.godDemonFlyRemain));
        flyEl.classList.remove('hidden');
      } else {
        flyEl.textContent = '';
        flyEl.classList.add('hidden');
      }
    }
    btn.classList.toggle('touch-god--held', !!(sideHeld && hasGod));
    btn.classList.toggle('touch-god--tier-martial', tier === 'martial');
    btn.classList.toggle('touch-god--tier-gunner', tier === 'gunner');
    btn.classList.toggle('touch-god--tier-ronin', tier === 'ronin');
    btn.classList.toggle('touch-god--tier-thor', tier === 'thor');
    btn.classList.toggle('touch-god--tier-berserker', tier === 'berserker');
    btn.classList.toggle('touch-god--tier-angel', tier === 'angel');
    btn.classList.toggle('touch-god--tier-demon', tier === 'demon');
    btn.classList.toggle('touch-god--active-thor', !!(owner.godThorMoveActive && tier === 'thor'));
    btn.classList.toggle(
      'touch-god--active-rage',
      !!(owner.godRageActive && tier && (tier === 'martial' || tier === 'ronin' || tier === 'berserker' || tier === 'gunner'))
    );
    btn.classList.toggle('touch-god--active-angel', !!(owner.godAngelSummonActive && tier === 'angel'));
    btn.classList.toggle(
      'touch-god--active-demon',
      !!(owner.godDemonFlyRemain > 0 && tier === 'demon')
    );
  }

  function setTouchBtnCooldown(btn, show, text) {
    const cd = btn && btn.querySelector('.touch-btn-cd');
    if (!cd) return;
    cd.hidden = !show;
    if (show) cd.textContent = text;
  }

  function updateExternalTouchHud() {
    if (!useExternalTouchHud) return;
    const showRails = gameState === 'playing' && !controlsHelpOpen;
    touchRailP1.classList.toggle('hidden', !showRails);
    if (touchRailP2) touchRailP2.classList.toggle('hidden', !showRails || !isCoopMode);
    const godBar = document.getElementById('god-touch-bar');
    if (godBar) godBar.classList.toggle('hidden', !showRails || isVersusMode);
    const godP2Btn = document.getElementById('touch-god-p2');
    if (godP2Btn) godP2Btn.classList.toggle('hidden', !isCoopMode);
    if (!showRails) return;

    applyTouchHudI18n();

    const tier = getCurrentGodSkillTier();
    const hasGod = !!tier;
    const godP1 = document.getElementById('touch-god-p1');
    const godP2 = document.getElementById('touch-god-p2');
    const heldP1 = godSkillKeyHeld || godPointerIdsP1.size > 0;
    const heldP2 = godSkillKeyHeldP2 || godPointerIdsP2.size > 0;
    styleExternalGodButton(godP1, tier, hasGod, heldP1);
    styleExternalGodButton(godP2, tier, hasGod, heldP2);

    const dodgeP1 = document.getElementById('touch-dodge-p1');
    const dodgeCd1 = Math.max(0, player.dodgeCooldown || 0);
    const dodgeReady1 = dodgeCd1 <= 0;
    if (dodgeP1) {
      dodgeP1.classList.toggle('touch-btn--ready', dodgeReady1);
      setTouchBtnCooldown(dodgeP1, !dodgeReady1, String(Math.ceil(dodgeCd1)));
    }
    const dodgeP2 = document.getElementById('touch-dodge-p2');
    if (dodgeP2 && isCoopMode) {
      const dodgeCd2 = Math.max(0, player2.dodgeCooldown || 0);
      const dodgeReady2 = dodgeCd2 <= 0;
      dodgeP2.classList.toggle('touch-btn--ready', dodgeReady2);
      setTouchBtnCooldown(dodgeP2, !dodgeReady2, String(Math.ceil(dodgeCd2)));
    }

    const jBtn = document.getElementById('touch-j-p1');
    if (jBtn) jBtn.classList.toggle('touch-btn--ready', player.state === 'alive');
    const lBtn = document.getElementById('touch-l-p1');
    if (lBtn) lBtn.classList.toggle('touch-btn--ready', player.state === 'alive');

    const kBtn = document.getElementById('touch-k-p1');
    if (kBtn) {
      const cdMs = Math.max(0, player.superAttackCooldown || 0);
      const kReady = cdMs <= 0;
      kBtn.classList.toggle('touch-btn--ready', kReady && player.state === 'alive');
      setTouchBtnCooldown(kBtn, !kReady, String(Math.ceil(cdMs / 1000)));
      if (player.state === 'alive') updateExternalTouchSuperThumb(kBtn, player);
    }

    const bBtn = document.getElementById('touch-b-p2');
    const mBtn = document.getElementById('touch-m-p2');
    const nBtn = document.getElementById('touch-n-p2');
    if (isCoopMode) {
      if (bBtn) bBtn.classList.toggle('touch-btn--ready', player2.state === 'alive');
      if (mBtn) mBtn.classList.toggle('touch-btn--ready', player2.state === 'alive');
      if (nBtn) {
        const cdMs2 = Math.max(0, player2.superAttackCooldown || 0);
        const nReady = cdMs2 <= 0;
        nBtn.classList.toggle('touch-btn--ready', nReady && player2.state === 'alive');
        setTouchBtnCooldown(nBtn, !nReady, String(Math.ceil(cdMs2 / 1000)));
        if (player2.state === 'alive') updateExternalTouchSuperThumb(nBtn, player2);
      }
    }
  }

  function drawVersusOverlay(ctx) {
    if (!isVersusMode) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const rDisp =
      versusPhase === 'fighting'
        ? versusRoundsCompleted + 1
        : Math.min(5, versusRoundsCompleted + 1);
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 6;
    ctx.fillText(tr('versus_hud', rDisp, versusWinsP1, versusWinsP2), config.width / 2, 30);
    ctx.shadowBlur = 0;

    if (versusPhase === 'intermission') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(0, config.height / 2 - 70, config.width, 130);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 26px system-ui, sans-serif';
      const msg = versusBannerKey ? tr(versusBannerKey) : '';
      ctx.fillText(msg, config.width / 2, config.height / 2 - 10);
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(
        tr('versus_hud', Math.min(5, versusRoundsCompleted + 1), versusWinsP1, versusWinsP2),
        config.width / 2,
        config.height / 2 + 22
      );
    }

    if (versusPhase === 'match_end') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 34px system-ui, sans-serif';
      ctx.fillText(tr('versus_match_title'), config.width / 2, config.height / 2 - 48);
      let sub;
      if (versusWinsP1 > versusWinsP2) sub = tr('versus_match_win_p1');
      else if (versusWinsP2 > versusWinsP1) sub = tr('versus_match_win_p2');
      else sub = tr('versus_match_tie');
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText(sub, config.width / 2, config.height / 2);
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(tr('versus_press_continue'), config.width / 2, config.height / 2 + 44);
    }
    ctx.restore();
  }

  // ========== 绘制 ==========
  function draw() {
    if (useExternalTouchHud) updateExternalTouchHud();
    let dx = 0;
    let dy = 0;
    if (shakeRemain > 0 && shakePeakMs > 0) {
      const env = Math.pow(
        Math.max(0.05, Math.min(1, shakeRemain / shakePeakMs)),
        0.72
      );
      const amp = shakeAmount * env;
      const st = performance.now() * 0.001;
      const hiFreq = Math.sin(st * 52) * amp * 0.2 + Math.cos(st * 47) * amp * 0.14;
      const dir = Math.random() < 0.5 ? 1 : -1;
      dx = dir * amp * (0.52 + Math.random() * 0.48) + hiFreq;
      dy = (Math.random() - 0.5) * 2 * amp * 0.9 + Math.sin(st * 38) * amp * 0.16;
    }

    ctx.save();
    ctx.translate(dx, dy);
    ctx.imageSmoothingEnabled = false;

    // 慢动作镜头聚焦：以击杀点为中心缩放
    if (slowMotionTimer > 0 && slowMotionImpact) {
      const p = Math.max(0, Math.min(1, slowMotionTimer / slowMotionDuration)); // 1 -> 0
      const s = 1 + 0.05 * p; // 1.05 -> 1.0
      ctx.translate(slowMotionImpact.x, slowMotionImpact.y);
      ctx.scale(s, s);
      ctx.translate(-slowMotionImpact.x, -slowMotionImpact.y);
    }

    // 简单深蓝背景 + 地面线（强制纯色方块模式）
    if (FORCE_RECT_RENDER) {
      ctx.fillStyle = '#0b1026';
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, config.groundY + 0.5);
      ctx.lineTo(config.width, config.groundY + 0.5);
      ctx.stroke();
    } else {
      drawParallaxBackground();
    }

    for (const s of bloodStains) {
      const alpha = Math.max(0, s.life / s.maxLife) * 0.7;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.fillStyle = `rgba(80, 20, 20, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const b of bleedEffects) {
      const img = b.shotImgs[b.shotIndex];
      const framesInThisShot = b.shotFrames[b.shotIndex] || 1;
      if (!img || !img.complete || img.naturalWidth <= 0 || img.naturalHeight <= 0) {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
        ctx.fillRect(b.x - b.drawW / 2, b.y - b.drawH, b.drawW, b.drawH);
        continue;
      }
      const sw = Math.floor(img.naturalWidth / framesInThisShot);
      const sh = img.naturalHeight;
      const sx = Math.min(framesInThisShot - 1, b.frame) * sw;
      const dw = b.drawW;
      const dh = b.drawH;
      ctx.save();
      ctx.translate(Math.round(b.x), Math.round(b.y));
      if (b.facing === -1) ctx.scale(-1, 1);
      ctx.drawImage(img, sx, 0, sw, sh, -dw / 2, -dh, dw, dh);
      ctx.restore();
    }

    const t = performance.now() / 1000;

    // 雷神闪电移动：电弧拖尾（在角色身后）
    if (thorSkillTrailParticles.length) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const p of thorSkillTrailParticles) {
        if (p.x0 == null || p.x1 == null) continue;
        const maxL = p.maxLife || 0.35;
        const a = Math.max(0, p.life / maxL);
        const wob = p.wobble || 4;
        const mx =
          (p.x0 + p.x1) * 0.5 + Math.sin(t * 14 + p.phase) * wob * (0.35 + 0.65 * a);
        const my =
          (p.y0 + p.y1) * 0.5 + Math.cos(t * 11 + p.phase * 1.3) * wob * 0.35 * a;
        const lg = ctx.createLinearGradient(p.x0, p.y0, p.x1, p.y1);
        lg.addColorStop(0, `rgba(255, 255, 255, ${0.95 * a})`);
        lg.addColorStop(0.35, `rgba(200, 240, 255, ${0.82 * a})`);
        lg.addColorStop(0.65, `rgba(100, 190, 255, ${0.55 * a})`);
        lg.addColorStop(1, `rgba(40, 100, 220, ${0.12 * a})`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = (p.w || 2) * (0.45 + 0.55 * a);
        ctx.globalAlpha = 1;
        ctx.shadowColor = `rgba(140, 210, 255, ${0.75 * a})`;
        ctx.shadowBlur = 14 * a;
        ctx.beginPath();
        ctx.moveTo(p.x0, p.y0);
        ctx.quadraticCurveTo(mx, my, p.x1, p.y1);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.35 * a;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * a})`;
        ctx.lineWidth = Math.max(0.8, (p.w || 2) * 0.35);
        ctx.beginPath();
        ctx.moveTo(p.x0, p.y0);
        ctx.lineTo(p.x1, p.y1);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }

    // 流浪剑客：足下红色粒子拖尾
    if (roninFootTrailParticles.length) {
      ctx.save();
      for (const p of roninFootTrailParticles) {
        const maxL = p.maxLife || 0.4;
        const a = Math.max(0, p.life / maxL);
        const s = (p.size || 2.5) * (0.45 + 0.55 * a);
        ctx.globalAlpha = a * 0.88;
        ctx.fillStyle = `rgba(255, ${55 + Math.floor(70 * a)}, ${40 + Math.floor(35 * a)}, ${0.4 + 0.45 * a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ========== 玩家绘制（最安全版 - 永远不会导致消失）==========
    const hidePunchLayer = false; // 枪系统停用：不再隐藏拳头层
    ctx.save();
    if (player.isDodging) ctx.globalAlpha = 0.4;
    if (player.state === 'dead' && deathSprite && deathSprite.img) {
      deathSprite.draw(ctx, player.x, player.y, {
        scale: config.deathDrawScale,
        flipX: player.facing === -1,
      });
    } 
    else if (player.isSuperAttacking) {
      // 超级拳动画（棍子敲击）
      if (
        superAttackSprite &&
        superAttackSprite.complete &&
        superAttackSprite.naturalWidth >= player.superAttackFrameWidth
      ) {
        try {
          const frameX = player.superAttackFrame * player.superAttackFrameWidth;
          ctx.save();
          if (player.facing === -1) {
            ctx.translate(player.x + config.playerWidth, player.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
              superAttackSprite,
              frameX, 0,
              player.superAttackFrameWidth, player.superAttackFrameHeight,
              0, 0,
              config.playerWidth, config.playerHeight
            );
          } else {
            ctx.drawImage(
              superAttackSprite,
              frameX, 0,
              player.superAttackFrameWidth, player.superAttackFrameHeight,
              player.x, player.y,
              config.playerWidth, config.playerHeight
            );
          }
          ctx.restore();
        } catch (e) {
          // 出现任何错误时，立即退回普通出拳/绿色方块，避免整帧渲染中断
          if (punchSprite && punchSprite.img) {
            punchSprite.draw(ctx, player.x, player.y, {
              scale: config.punchDrawScale,
              flipX: player.facing === -1,
            });
          } else {
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(player.x, player.y, config.playerWidth, config.playerHeight);
          }
        }
      } else {
        // 保护1：图片没加载时画普通出拳动画
        if (punchSprite && punchSprite.img) {
          punchSprite.draw(ctx, player.x, player.y, {
            scale: config.punchDrawScale,
            flipX: player.facing === -1,
          });
        } else {
          // 保护2：最坏情况画绿色方块
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(player.x, player.y, config.playerWidth, config.playerHeight);
        }
      }
    } 
    else if (player.anim === 'attack' && punchSprite && punchSprite.img) {
      punchSprite.draw(ctx, player.x, player.y, {
        scale: config.punchDrawScale,
        flipX: player.facing === -1,
      });
    } 
    else if (player.anim === 'run' && runSprite && runSprite.img) {
      runSprite.draw(ctx, player.x, player.y, {
        scale: config.runDrawScale,
        flipX: player.facing === -1,
      });
    } 
    else if (idleSprite && idleSprite.img) {
      idleSprite.draw(ctx, player.x, player.y, {
        scale: config.idleDrawScale,
        flipX: player.facing === -1,
      });
    } 
    else {
      // 保护3：最后底线
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(player.x, player.y, config.playerWidth, config.playerHeight);
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('P1', player.x + config.playerWidth / 2, player.y - 8);
    ctx.textAlign = 'left';
    ctx.restore();

    if (isCoopMode && (player2.state === 'alive' || player2.state === 'dead')) {
      ctx.save();
      if (player2.state === 'alive' && player2.isDodging) ctx.globalAlpha = 0.4;
      if (player2.state === 'dead' && deathSpriteP2 && deathSpriteP2.img) {
        deathSpriteP2.draw(ctx, player2.x, player2.y, {
          scale: config.deathDrawScale,
          flipX: player2.facing === -1,
        });
      } else if (player2.isSuperAttacking) {
        if (
          superAttackSprite &&
          superAttackSprite.complete &&
          superAttackSprite.naturalWidth >= player2.superAttackFrameWidth
        ) {
          const frameX = player2.superAttackFrame * player2.superAttackFrameWidth;
          ctx.save();
          if (player2.facing === -1) {
            ctx.translate(player2.x + config.playerWidth, player2.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
              superAttackSprite,
              frameX, 0,
              player2.superAttackFrameWidth, player2.superAttackFrameHeight,
              0, 0,
              config.playerWidth, config.playerHeight
            );
          } else {
            ctx.drawImage(
              superAttackSprite,
              frameX, 0,
              player2.superAttackFrameWidth, player2.superAttackFrameHeight,
              player2.x, player2.y,
              config.playerWidth, config.playerHeight
            );
          }
          ctx.restore();
        } else if (punchSpriteP2 && punchSpriteP2.img) {
          punchSpriteP2.draw(ctx, player2.x, player2.y, {
            scale: config.punchDrawScale,
            flipX: player2.facing === -1,
          });
        } else {
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(player2.x, player2.y, config.playerWidth, config.playerHeight);
        }
      } else if (player2.anim === 'attack' && punchSpriteP2 && punchSpriteP2.img) {
        punchSpriteP2.draw(ctx, player2.x, player2.y, {
          scale: config.punchDrawScale,
          flipX: player2.facing === -1,
        });
      } else if (player2.anim === 'run' && runSpriteP2 && runSpriteP2.img) {
        runSpriteP2.draw(ctx, player2.x, player2.y, {
          scale: config.runDrawScale,
          flipX: player2.facing === -1,
        });
      } else if (idleSpriteP2 && idleSpriteP2.img) {
        idleSpriteP2.draw(ctx, player2.x, player2.y, {
          scale: config.idleDrawScale,
          flipX: player2.facing === -1,
        });
      } else {
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(player2.x, player2.y, config.playerWidth, config.playerHeight);
      }
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('P2', player2.x + config.playerWidth / 2, player2.y - 8);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    // 天使降临：fly 精灵（左女 Z7eSP / 男右 z0qOP，去底 PNG）
    if (player.godAngelSummonActive && player.godAngelMinions.length && player.state === 'alive') {
      for (const m of player.godAngelMinions) drawAngelMinionSprite(ctx, m, t);
    }
    if (
      isCoopMode &&
      player2.godAngelSummonActive &&
      player2.godAngelMinions.length &&
      player2.state === 'alive'
    ) {
      for (const m of player2.godAngelMinions) drawAngelMinionSprite(ctx, m, t);
    }

    drawGodTierHaloAboveActor(ctx, player, t);
    if (isCoopMode) drawGodTierHaloAboveActor(ctx, player2, t);

    // 格挡能量护盾（多层科幻效果）
    if (player.isBlocking && player.state === 'alive') {
      const cxBase = player.facing === 1 ? player.x + config.playerWidth + 5 : player.x - 5;
      const cy = player.y + config.playerHeight / 2;
      const shakeX = player.blockShakeTimer > 0 ? (Math.random() - 0.5) * 4 : 0;
      const cx = cxBase + shakeX;
      const r = 38;
      const startA = player.facing === 1 ? -Math.PI / 2 : Math.PI / 2;
      const endA = player.facing === 1 ? Math.PI / 2 : Math.PI * 1.5;
      const pulseAlpha = 0.82 + Math.sin(t * 3) * 0.08;
      const isGold = player.shieldGoldTimer > 0;
      const edgeColor = isGold ? `rgba(255, 210, 80, ${0.78 * pulseAlpha})` : `rgba(100, 200, 255, ${0.7 * pulseAlpha})`;
      const hexColor = isGold ? '255, 215, 110' : '120, 200, 255';

      ctx.save();

      // 第1层：主护盾体（径向渐变）
      const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      if (isGold) {
        grad.addColorStop(0, `rgba(255, 220, 100, ${0.08 * pulseAlpha})`);
        grad.addColorStop(1, `rgba(255, 190, 40, ${0.28 * pulseAlpha})`);
      } else {
        grad.addColorStop(0, `rgba(100, 180, 255, ${0.05 * pulseAlpha})`);
        grad.addColorStop(1, `rgba(60, 150, 255, ${0.25 * pulseAlpha})`);
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = player.blockFlashTimer > 0 ? 'rgba(255,255,255,0.95)' : edgeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.stroke();

      // 第2层：六边形蜂窝纹路
      const hexCount = 6;
      for (let i = 0; i < hexCount; i++) {
        const ratio = (i + 1) / (hexCount + 1);
        const ang = startA + (endA - startA) * ratio;
        const hr = r - 11 + Math.sin(t * 2 + i * 0.8) * 2;
        const hx = cx + Math.cos(ang) * hr;
        const hy = cy + Math.sin(ang) * hr;
        const size = 8 + (i % 3);
        const a = player.blockFlashTimer > 0 ? 0.9 : (0.18 + (Math.sin(t * 3.2 + i * 1.2) + 1) * 0.12);
        ctx.strokeStyle = `rgba(${hexColor}, ${a})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ha = (Math.PI / 3) * k + Math.PI / 6;
          const px = hx + Math.cos(ha) * size;
          const py = hy + Math.sin(ha) * size;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 第3层：外发光（多层弧线）
      const glowAlphas = [0.15, 0.08, 0.03];
      for (let i = 0; i < glowAlphas.length; i++) {
        const rr = r + 2 + i * 2;
        const ga = glowAlphas[i] * pulseAlpha;
        ctx.strokeStyle = isGold ? `rgba(255, 210, 100, ${ga})` : `rgba(100, 180, 255, ${ga})`;
        ctx.lineWidth = 2.2 - i * 0.45;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, startA, endA);
        ctx.stroke();
      }

      // 第4层：能量粒子 + 拖尾（最多15）
      const arcR = r - 2;
      for (const p of shieldParticles.slice(0, 15)) {
        const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
        const x = cx + Math.cos(p.theta) * arcR;
        const y = cy + Math.sin(p.theta) * arcR;
        const tailX = cx + Math.cos(p.theta - 0.08 * (player.facing === 1 ? 1 : -1)) * (arcR - 4);
        const tailY = cy + Math.sin(p.theta - 0.08 * (player.facing === 1 ? 1 : -1)) * (arcR - 4);
        const tg = ctx.createLinearGradient(tailX, tailY, x, y);
        if (isGold) {
          tg.addColorStop(0, `rgba(255, 215, 120, 0)`);
          tg.addColorStop(1, `rgba(255, 235, 170, ${0.85 * alpha})`);
        } else {
          tg.addColorStop(0, 'rgba(180, 220, 255, 0)');
          tg.addColorStop(1, `rgba(235, 248, 255, ${0.85 * alpha})`);
        }
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = isGold ? `rgba(255, 230, 170, ${alpha})` : `rgba(240, 250, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 受击/完美格挡火花
      for (const s of shieldSparks.slice(0, 15)) {
        const a = Math.max(0, s.life / s.maxLife);
        ctx.fillStyle = `rgba(${s.color}, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.3 + 1.5 * a, 0, Math.PI * 2);
        ctx.fill();
      }

      // 第5层：能量脉冲（0.3秒）
      if (player.shieldPulseActive) {
        const p = Math.max(0, Math.min(1, player.shieldPulseAge / 0.3));
        const pr = 20 + (isGold ? 60 : 30) * p;
        const pa = (isGold ? 0.55 : 0.4) * (1 - p);
        ctx.strokeStyle = isGold ? `rgba(255, 210, 90, ${pa})` : `rgba(120, 200, 255, ${pa})`;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(cx, cy, pr, startA, endA);
        ctx.stroke();
      }

      ctx.restore();
    }

    // P2 格挡护盾（双人模式）
    if (isCoopMode && player2.isBlocking && player2.state === 'alive') {
      const cxBase = player2.facing === 1 ? player2.x + config.playerWidth + 5 : player2.x - 5;
      const cy = player2.y + config.playerHeight / 2;
      const shakeX = player2.blockShakeTimer > 0 ? (Math.random() - 0.5) * 4 : 0;
      const cx = cxBase + shakeX;
      const r = 38;
      const startA = player2.facing === 1 ? -Math.PI / 2 : Math.PI / 2;
      const endA = player2.facing === 1 ? Math.PI / 2 : Math.PI * 1.5;
      const pulseAlpha = 0.82 + Math.sin(t * 3) * 0.08;
      const isGold = player2.shieldGoldTimer > 0;
      const edgeColor = isGold ? `rgba(255, 210, 80, ${0.78 * pulseAlpha})` : `rgba(100, 200, 255, ${0.7 * pulseAlpha})`;
      const hexColor = isGold ? '255, 215, 110' : '120, 200, 255';
      ctx.save();

      const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      if (isGold) {
        grad.addColorStop(0, `rgba(255, 220, 100, ${0.08 * pulseAlpha})`);
        grad.addColorStop(1, `rgba(255, 190, 40, ${0.28 * pulseAlpha})`);
      } else {
        grad.addColorStop(0, `rgba(100, 180, 255, ${0.05 * pulseAlpha})`);
        grad.addColorStop(1, `rgba(60, 150, 255, ${0.25 * pulseAlpha})`);
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = player2.blockFlashTimer > 0 ? 'rgba(255,255,255,0.95)' : edgeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const ratio = (i + 1) / 7;
        const ang = startA + (endA - startA) * ratio;
        const hr = r - 11 + Math.sin(t * 2 + i * 0.8) * 2;
        const hx = cx + Math.cos(ang) * hr;
        const hy = cy + Math.sin(ang) * hr;
        const size = 8 + (i % 3);
        const a = player2.blockFlashTimer > 0 ? 0.9 : (0.18 + (Math.sin(t * 3.2 + i * 1.2) + 1) * 0.12);
        ctx.strokeStyle = `rgba(${hexColor}, ${a})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const ha = (Math.PI / 3) * k + Math.PI / 6;
          const px = hx + Math.cos(ha) * size;
          const py = hy + Math.sin(ha) * size;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      const glowAlphas = [0.15, 0.08, 0.03];
      for (let i = 0; i < glowAlphas.length; i++) {
        const rr = r + 2 + i * 2;
        const ga = glowAlphas[i] * pulseAlpha;
        ctx.strokeStyle = isGold ? `rgba(255, 210, 100, ${ga})` : `rgba(100, 180, 255, ${ga})`;
        ctx.lineWidth = 2.2 - i * 0.45;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, startA, endA);
        ctx.stroke();
      }

      const arcR = r - 2;
      for (const p of shieldParticlesP2.slice(0, 15)) {
        const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
        const x = cx + Math.cos(p.theta) * arcR;
        const y = cy + Math.sin(p.theta) * arcR;
        const tailX = cx + Math.cos(p.theta - 0.08 * (player2.facing === 1 ? 1 : -1)) * (arcR - 4);
        const tailY = cy + Math.sin(p.theta - 0.08 * (player2.facing === 1 ? 1 : -1)) * (arcR - 4);
        const tg = ctx.createLinearGradient(tailX, tailY, x, y);
        if (isGold) {
          tg.addColorStop(0, `rgba(255, 215, 120, 0)`);
          tg.addColorStop(1, `rgba(255, 235, 170, ${0.85 * alpha})`);
        } else {
          tg.addColorStop(0, 'rgba(180, 220, 255, 0)');
          tg.addColorStop(1, `rgba(235, 248, 255, ${0.85 * alpha})`);
        }
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = isGold ? `rgba(255, 230, 170, ${alpha})` : `rgba(240, 250, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of shieldSparksP2.slice(0, 15)) {
        const a = Math.max(0, s.life / s.maxLife);
        ctx.fillStyle = `rgba(${s.color}, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.3 + 1.5 * a, 0, Math.PI * 2);
        ctx.fill();
      }

      if (player2.shieldPulseActive) {
        const p = Math.max(0, Math.min(1, player2.shieldPulseAge / 0.3));
        const pr = 20 + (isGold ? 60 : 30) * p;
        const pa = (isGold ? 0.55 : 0.4) * (1 - p);
        ctx.strokeStyle = isGold ? `rgba(255, 210, 90, ${pa})` : `rgba(120, 200, 255, ${pa})`;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(cx, cy, pr, startA, endA);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 枪系统停用：不绘制枪口火焰与玩家子弹

    const inAttack = player.attackStart > 0 && t - player.attackStart < (player.attackDurationSec || config.attackDuration / 1000);
    if (inAttack && DEBUG_HITBOX) {
      const box = getPlayerAttackBox();
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 1;
      ctx.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
    }
    if (DEBUG_HITBOX && player.hp > 0) {
      const hb = getPlayerHitbox();
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;
      ctx.strokeRect(hb.left, hb.top, hb.right - hb.left, hb.bottom - hb.top);
    }
    if (isCoopMode && DEBUG_HITBOX && player2.hp > 0) {
      const inAttack2 =
        player2.attackStart > 0 &&
        t - player2.attackStart < (player2.attackDurationSec || config.attackDuration / 1000);
      if (inAttack2) {
        const box2 = getPlayer2AttackBox();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.strokeRect(box2.left, box2.top, box2.right - box2.left, box2.bottom - box2.top);
      }
      const hb2 = getPlayer2Hitbox();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(hb2.left, hb2.top, hb2.right - hb2.left, hb2.bottom - hb2.top);
    }

    function drawComboHitUiForActor(actor) {
      if (!actor || actor.comboUiTimer <= 0 || actor.comboUiStep <= 0) return;
      const step = actor.comboUiStep;
      const maxT = 0.18;
      const a = Math.max(0, Math.min(1, actor.comboUiTimer / maxT));
      const bob = Math.sin(t * 18) * 2.0;
      const x = actor.x + config.playerWidth / 2;
      const y = actor.y - 10 + bob;

      ctx.save();
      ctx.globalAlpha = a;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (step === 1) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.fillText('1', x, y);
      } else if (step === 2) {
        ctx.fillStyle = '#60a5fa';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.fillText('2', x, y);
      } else if (step === 3) {
        const scale = 1 + Math.max(0, 1 - a) * 0.35;
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 26px system-ui, sans-serif';
        ctx.fillText('3!', 0, 0);
      }
      ctx.restore();
    }

    drawComboHitUiForActor(player);
    if (isCoopMode) drawComboHitUiForActor(player2);

    // 连招拳风特效
    for (const w of punchWindEffects) {
      if (!w || w.life <= 0) continue;
      const a = Math.max(0, Math.min(1, w.life / (w.maxLife || 0.15)));
      const step = w.step || 1;
      const isGold = step === 3;
      const isBlue = step === 2;

      const startA = w.facing === 1 ? Math.PI * 0.5 : -Math.PI * 0.5; // 底部开始
      const endA = w.facing === 1 ? -Math.PI * 0.5 : Math.PI * 0.5; // 朝上扫

      const rr = w.radius * (1 + (1 - a) * 0.35);
      ctx.save();
      ctx.globalAlpha = 0.2 + a * 0.8;
      ctx.beginPath();
      ctx.arc(w.x, w.y, rr, startA, endA, w.facing === -1);
      ctx.lineCap = 'round';
      ctx.lineWidth = step === 1 ? 3.2 : step === 2 ? 4.0 : 5.0;
      ctx.strokeStyle = thorMode
        ? (step === 1
            ? `rgba(210, 245, 255, ${a * 0.96})`
            : step === 2
              ? `rgba(100, 190, 255, ${a * 0.97})`
              : `rgba(255, 252, 220, ${a * 0.98})`)
        : demonMode
          ? (step === 1
              ? `rgba(32, 16, 78, ${a * 0.97})`
              : step === 2
                ? `rgba(48, 20, 112, ${a * 0.98})`
                : `rgba(72, 22, 98, ${a * 0.98})`)
          : angelMode
            ? (step === 1
                ? `rgba(255, 248, 200, ${a * 0.88})`
                : step === 2
                  ? `rgba(255, 230, 150, ${a * 0.9})`
                  : `rgba(255, 215, 100, ${a * 0.95})`)
            : isGold
            ? `rgba(255, 210, 90, ${a * 0.85})`
            : isBlue
              ? `rgba(120, 200, 255, ${a * 0.75})`
              : `rgba(255, 255, 255, ${a * 0.7})`;
      ctx.stroke();
      ctx.restore();
    }

    if (!hidePunchLayer) {
      for (let i = slashEffects.length - 1; i >= 0; i--) {
        const s = slashEffects[i];
        const elapsed = t - s.startTime;
        if (elapsed >= s.duration) {
          slashEffects.splice(i, 1);
          continue;
        }
        const alpha = 1 - elapsed / s.duration;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(s.facing, 1);
        ctx.beginPath();
        ctx.arc(0, 0, 55, -Math.PI * 0.6, Math.PI * 0.6);
        ctx.strokeStyle = s.hit ? `rgba(255, 220, 150, ${alpha * 0.9})` : `rgba(150, 200, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    // 招式名称浮动文字（连招反馈）
    for (const n of comboNameEffects) {
      const alpha = Math.max(
        0,
        Math.min(1, n.life / ((n.maxLife || 0.8) * 0.3)) // 只在最后30%时间淡出
      );
      ctx.save();
      ctx.translate(n.x, n.y);
      const sc = n.scale || 1;
      ctx.scale(sc, sc);
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${n.size || 20}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 3;
      ctx.strokeText(n.text, 0, 0);
      ctx.fillStyle = n.color || '#ffffff';
      ctx.fillText(n.text, 0, 0);
      ctx.restore();
    }

    for (const enemy of enemies) {
      // 小怪/中型怪死亡动画阶段也要绘制，播完后在 updateEnemies 中移除
      if (
        enemy.hp <= 0 &&
        !(((isMiniZombie(enemy) || isAxeEnemy(enemy)) && enemy.isDying) || (enemy.isBoss && enemy.isDying))
      ) continue;
      // 让可见身体、HEART BOX 完全对齐：不再额外左右摇摆
      const ex = enemy.x;
      const ey = enemy.y;
      if (!FORCE_RECT_RENDER && (enemy.isBoss || isMiniZombie(enemy) || isAxeEnemy(enemy) || isSecEnemy(enemy) || (zombieAnimData && zombieAnimData.img))) {
        drawEnemySprite(enemy, ctx, ex, ey);
      } else {
        // 强制方块敌人：普通红色 48x80，Boss 橙色 72x120
        const w = enemy.isBoss ? 72 : 48;
        const h = enemy.isBoss ? 120 : 80;
        ctx.fillStyle = enemy.isBoss ? '#f97316' : '#ef4444';
        ctx.fillRect(ex, ey, w, h);
      }
      ctx.fillStyle = '#111827';
      ctx.font = '14px sans-serif';
      const label =
        enemy.isBoss ? 'B' :
        enemy.type === 'elite' ? 'E' :
        enemy.type === 'sec' ? 'N' :
        enemy.type === 'ranged' ? 'R' :
        enemy.type === 'charge' ? 'C' : 'M';
      ctx.fillText(label, ex + enemy.width / 2 - 4, ey + enemy.height / 2 + 4);
      // 敌人头顶血条：便于快速判断集火目标与斩杀线
      if (enemy.maxHp > 0) {
        const hpRate = Math.max(0, Math.min(1, enemy.hp / enemy.maxHp));
        const bw = Math.max(34, Math.round(enemy.width * (enemy.isBoss ? 0.92 : 0.86)));
        const bh = enemy.isBoss ? 7 : 5;
        const bx = ex + (enemy.width - bw) / 2;
        const by = ey - (enemy.isBoss ? 16 : 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
        ctx.fillStyle = 'rgba(71, 85, 105, 0.85)';
        ctx.fillRect(bx, by, bw, bh);
        if (hpRate > 0) {
          const fillW = Math.max(1, Math.round(bw * hpRate));
          ctx.fillStyle = enemy.isBoss ? '#f59e0b' : '#ef4444';
          ctx.fillRect(bx, by, fillW, bh);
        }
      }
      if (DEBUG_HITBOX) {
        if (gunnerMode) {
          const headHb = getEnemyHeadHitbox(enemy);
          const bodyHb = getEnemyBodyHitbox(enemy);
          ctx.strokeStyle = '#ff8800';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(headHb.left, headHb.top, headHb.right - headHb.left, headHb.bottom - headHb.top);
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 1;
          ctx.strokeRect(bodyHb.left, bodyHb.top, bodyHb.right - bodyHb.left, bodyHb.bottom - bodyHb.top);
        } else {
          const hb = getEnemyHitbox(enemy);
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 1;
          ctx.strokeRect(hb.left, hb.top, hb.right - hb.left, hb.bottom - hb.top);
        }
      }
      if (enemy.type === 'charge' && enemy.state === 'windup') {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', ex + enemy.width / 2, ey - 8);
        ctx.textAlign = 'left';
      }
      if (enemy.attackWarnTimer > 0) {
        const p = Math.max(0, Math.min(1, enemy.attackWarnTimer / 0.3));
        const s = 1 + p * 0.45;
        ctx.save();
        ctx.translate(ex + enemy.width / 2, ey - 14);
        ctx.scale(s, s);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', 0, 0);
        ctx.restore();
        ctx.textAlign = 'left';
      }
    }

    for (const q of roninSwordQi) {
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(q.rot);
      ctx.shadowColor = 'rgba(230, 240, 255, 0.85)';
      ctx.shadowBlur = 16;
      const g = ctx.createLinearGradient(-24, 0, 28, 0);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      g.addColorStop(0.3, 'rgba(218, 226, 238, 0.94)');
      g.addColorStop(0.65, 'rgba(168, 182, 202, 0.9)');
      g.addColorStop(1, 'rgba(118, 132, 152, 0.45)');
      ctx.fillStyle = g;
      ctx.fillRect(-24, -5.5, 54, 11);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(-24, -5.5, 54, 11);
      ctx.restore();
    }

    for (const ab of angelMinionBolts) {
      ctx.save();
      ctx.shadowColor = 'rgba(255, 220, 100, 0.9)';
      ctx.shadowBlur = 8;
      const g = ctx.createRadialGradient(ab.x, ab.y, 0, ab.x, ab.y, 7);
      g.addColorStop(0, 'rgba(255, 255, 245, 0.95)');
      g.addColorStop(0.45, 'rgba(255, 215, 80, 0.88)');
      g.addColorStop(1, 'rgba(200, 150, 30, 0.25)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ab.x, ab.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const w of xianglongPalmWaves) {
      const a = Math.max(0, w.life / (w.maxLife || 0.45));
      ctx.save();
      ctx.globalAlpha = a * 0.55;
      ctx.translate(w.x, w.y);
      ctx.rotate(w.rot || 0);
      ctx.strokeStyle = 'rgba(253, 230, 138, 0.95)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, w.r * 1.1, w.r * 0.56, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(103, 232, 249, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-w.r * 0.1, 0, w.r * 0.42, -1.2, 1.2);
      ctx.stroke();
      ctx.restore();
    }
    for (const s of xianglongSparks) {
      const a = Math.max(0, s.life / (s.maxLife || 0.55));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = s.cyan ? '#67e8f9' : '#fde68a';
      ctx.fillRect(s.x, s.y, s.size || 3, s.size || 3);
      ctx.restore();
    }
    for (const d of xianglongDragonPalms) {
      const a = Math.max(0, Math.min(1, d.life / (d.maxLife || 1.45)));
      const scale = d.scale || 0.56;
      const dw = xianglongDragonSprite.naturalWidth * scale;
      const dh = xianglongDragonSprite.naturalHeight * scale;
      ctx.save();
      ctx.globalAlpha = 0.18 * a;
      ctx.shadowColor = 'rgba(103, 232, 249, 0.9)';
      ctx.shadowBlur = 18;
      if (xianglongDragonSprite.complete && xianglongDragonSprite.naturalWidth > 0) {
        ctx.drawImage(xianglongDragonSprite, d.x - 30, d.y + 16, dw, dh);
      }
      ctx.globalAlpha = 0.95 * a;
      ctx.shadowBlur = 10;
      if (xianglongDragonSprite.complete && xianglongDragonSprite.naturalWidth > 0) {
        ctx.drawImage(xianglongDragonSprite, d.x, d.y, dw, dh);
      } else {
        const g = ctx.createLinearGradient(d.x, d.y, d.x + 180, d.y + 30);
        g.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        g.addColorStop(0.45, 'rgba(253, 230, 138, 0.95)');
        g.addColorStop(1, 'rgba(103, 232, 249, 0.9)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(d.x + 85, d.y + 60, 100, 28, d.rot || 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    drawGunnerBulletTracers(ctx);
    drawHeadshotBursts(ctx);

    for (const b of berserkerDeathBeams) {
      const a = Math.max(0, b.life / (b.maxLife || 0.58));
      const x = b.x;
      const y0 = -40;
      const y1 = Math.min((b.targetY || 0) + 28, config.groundY + 8);
      const w = b.width * (0.75 + 0.25 * a);
      const coreW = Math.max(4, w * 0.22);
      ctx.save();
      ctx.globalAlpha = Math.min(1, a * 1.05);
      const grad = ctx.createLinearGradient(x, y0, x, y1);
      if (b.isRoninSilver) {
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.45 * a})`);
        grad.addColorStop(0.35, `rgba(210, 218, 232, ${0.9 * a})`);
        grad.addColorStop(0.65, `rgba(150, 168, 192, ${0.94 * a})`);
        grad.addColorStop(1, `rgba(90, 105, 128, ${0.82 * a})`);
      } else if (b.isThorThunder) {
        grad.addColorStop(0, `rgba(240, 252, 255, ${0.42 * a})`);
        grad.addColorStop(0.35, `rgba(100, 200, 255, ${0.88 * a})`);
        grad.addColorStop(0.65, `rgba(60, 140, 255, ${0.95 * a})`);
        grad.addColorStop(1, `rgba(30, 70, 160, ${0.85 * a})`);
      } else if (b.isDemonDark) {
        grad.addColorStop(0, `rgba(28, 10, 62, ${0.55 * a})`);
        grad.addColorStop(0.35, `rgba(12, 4, 42, ${0.94 * a})`);
        grad.addColorStop(0.65, `rgba(58, 18, 88, ${0.96 * a})`);
        grad.addColorStop(1, `rgba(8, 2, 22, ${0.96 * a})`);
      } else {
        grad.addColorStop(0, `rgba(255, 252, 220, ${0.12 * a})`);
        grad.addColorStop(0.35, `rgba(255, 230, 140, ${0.55 * a})`);
        grad.addColorStop(0.65, `rgba(255, 200, 70, ${0.92 * a})`);
        grad.addColorStop(1, `rgba(255, 170, 40, ${0.85 * a})`);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(x - w / 2, y0, w, y1 - y0);
      const cg = ctx.createLinearGradient(x, y0, x, y1);
      if (b.isRoninSilver) {
        cg.addColorStop(0, `rgba(255, 255, 255, ${0.62 * a})`);
        cg.addColorStop(0.5, `rgba(225, 232, 245, ${0.92 * a})`);
        cg.addColorStop(1, `rgba(160, 175, 198, ${0.7 * a})`);
      } else if (b.isThorThunder) {
        cg.addColorStop(0, `rgba(255, 255, 255, ${0.55 * a})`);
        cg.addColorStop(0.5, `rgba(200, 235, 255, ${0.9 * a})`);
        cg.addColorStop(1, `rgba(100, 180, 255, ${0.65 * a})`);
      } else if (b.isDemonDark) {
        cg.addColorStop(0, `rgba(88, 32, 118, ${0.55 * a})`);
        cg.addColorStop(0.5, `rgba(130, 38, 78, ${0.88 * a})`);
        cg.addColorStop(1, `rgba(22, 8, 48, ${0.82 * a})`);
      } else {
        cg.addColorStop(0, `rgba(255, 255, 255, ${0.35 * a})`);
        cg.addColorStop(0.5, `rgba(255, 248, 200, ${0.75 * a})`);
        cg.addColorStop(1, `rgba(255, 220, 120, ${0.5 * a})`);
      }
      ctx.fillStyle = cg;
      ctx.fillRect(x - coreW / 2, y0, coreW, y1 - y0);
      ctx.fillStyle = b.isRoninSilver
        ? `rgba(255, 255, 255, ${0.42 * a})`
        : b.isThorThunder
          ? `rgba(255, 255, 255, ${0.38 * a})`
          : b.isDemonDark
            ? `rgba(140, 35, 75, ${0.55 * a})`
            : `rgba(255, 255, 240, ${0.25 * a})`;
      ctx.fillRect(x - w / 2, y1 - 6, w, 6);
      ctx.restore();
    }

    for (const p of hitParticles) {
      const alpha = Math.max(0, p.life / (p.maxLife || 0.3));
      if (p.isRoninSlash) {
        const ang = Math.atan2(p.vy, p.vx);
        const L = (p.slashL || 28) * (0.35 + 0.65 * alpha);
        const W = p.slashW || 3;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.globalAlpha = Math.min(1, alpha * 1.08);
        const g = ctx.createLinearGradient(0, 0, L, 0);
        g.addColorStop(0, `rgba(255, 255, 255, ${0.55 * alpha})`);
        g.addColorStop(0.22, `rgba(255, 140, 110, ${0.96 * alpha})`);
        g.addColorStop(0.52, `rgba(230, 35, 45, ${0.98 * alpha})`);
        g.addColorStop(1, `rgba(130, 12, 28, ${0.32 * alpha})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, -W / 2, L, W);
        ctx.restore();
        ctx.globalAlpha = 1;
      } else if (p.isLightning) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 0.3, p.y + p.vy * 0.3);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (p.isBerserkerBeam) {
        const ang = Math.atan2(p.vy, p.vx);
        const L = (p.beamL || 40) * (0.35 + 0.65 * alpha);
        const W = p.beamW || 4;
        const thunder = !!p.isThorThunder;
        const dark = !!p.isDemonDark && !thunder;
        const gold = !!p.isAngelGold && !dark && !thunder;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.globalAlpha = Math.min(1, alpha * 1.08);
        const g = ctx.createLinearGradient(0, 0, L, 0);
        if (thunder) {
          g.addColorStop(0, `rgba(255, 255, 255, ${0.72 * alpha})`);
          g.addColorStop(0.32, `rgba(140, 220, 255, ${0.98 * alpha})`);
          g.addColorStop(0.68, `rgba(40, 120, 255, ${0.96 * alpha})`);
          g.addColorStop(1, `rgba(20, 40, 120, ${0.55 * alpha})`);
        } else if (dark) {
          g.addColorStop(0, `rgba(62, 32, 118, ${0.72 * alpha})`);
          g.addColorStop(0.35, `rgba(8, 2, 32, ${0.99 * alpha})`);
          g.addColorStop(0.7, `rgba(72, 22, 92, ${0.97 * alpha})`);
          g.addColorStop(1, `rgba(2, 0, 10, ${0.72 * alpha})`);
        } else if (gold) {
          g.addColorStop(0, `rgba(255, 255, 240, ${0.35 * alpha})`);
          g.addColorStop(0.3, `rgba(255, 235, 150, ${0.95 * alpha})`);
          g.addColorStop(0.65, `rgba(255, 200, 80, ${0.98 * alpha})`);
          g.addColorStop(1, `rgba(220, 160, 40, ${0.45 * alpha})`);
        } else {
          g.addColorStop(0, `rgba(255, 200, 200, ${0.15 * alpha})`);
          g.addColorStop(0.35, `rgba(255, 120, 90, ${0.92 * alpha})`);
          g.addColorStop(0.72, `rgba(255, 40, 30, ${0.95 * alpha})`);
          g.addColorStop(1, `rgba(200, 20, 40, ${0.35 * alpha})`);
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, -W / 2, L, W);
        ctx.fillStyle = thunder
          ? `rgba(255, 255, 255, ${0.78 * alpha})`
          : dark
            ? `rgba(150, 45, 95, ${0.82 * alpha})`
            : gold
              ? `rgba(255, 255, 255, ${0.55 * alpha})`
              : `rgba(255, 250, 220, ${0.42 * alpha})`;
        const iw = Math.max(1.5, W * 0.38);
        ctx.fillRect(L * 0.5, -iw / 2, L * 0.42, iw);
        ctx.restore();
        ctx.globalAlpha = 1;
      } else if (p.isRageGold) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5);
        g.addColorStop(0, `rgba(255, 255, 240, ${0.95 * alpha})`);
        g.addColorStop(0.45, `rgba(255, 210, 100, ${0.85 * alpha})`);
        g.addColorStop(1, `rgba(255, 160, 40, ${0.15 * alpha})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.isRageRed) {
        ctx.fillStyle = `rgba(255, 55, 35, ${0.92 * alpha})`;
        ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5);
      } else {
        ctx.fillStyle = `rgba(100, 25, 25, ${alpha})`;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      }
    }

    for (let i = hitFlashEffects.length - 1; i >= 0; i--) {
      const f = hitFlashEffects[i];
      const elapsed = t - f.startTime;
      if (elapsed >= f.duration) {
        hitFlashEffects.splice(i, 1);
        continue;
      }
      const alpha = 1 - elapsed / f.duration;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.fill();
    }

    // 绘制完美格挡金色粒子
    for (const p of perfectBlockParticles) {
      const alpha = Math.max(0, p.life / p.maxLife);

      // 绘制拖尾（渐变消失的尾巴）
      if (p.trail.length >= 2) {
        for (let j = 0; j < p.trail.length - 1; j++) {
          const ta = alpha * (j / p.trail.length) * 0.4;
          ctx.beginPath();
          ctx.moveTo(p.trail[j].x, p.trail[j].y);
          ctx.lineTo(p.trail[j + 1].x, p.trail[j + 1].y);
          ctx.strokeStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${ta})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();
        }
      }

      if (p.type === 'spark') {
        // 火花型：画一条旋转的短线
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.moveTo(-p.size * 2, 0);
        ctx.lineTo(p.size * 2, 0);
        ctx.strokeStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`;
        ctx.lineWidth = p.size * 0.7;
        ctx.stroke();
        ctx.restore();
      } else {
        // 圆点型：发光的金色圆点
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha * 0.12})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha * 0.3})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 245, 200, ${alpha * 0.9})`;
        ctx.fill();
      }
    }

    ctx.fillStyle = '#f97316';
    for (const p of projectiles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const a of bossAoes) {
      const alpha = Math.max(0, a.life / config.bossAoeDuration);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(248, 113, 113, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    const alpha = StageController.getLabelAlpha();
    if (alpha > 0) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#f9fafb';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(StageController.labelText, config.width / 2, 80);
      ctx.restore();
    }

    let enragedTimer = 0;
    for (const e of enemies) {
      if (e.isBoss && e.enragedLabelTimer > 0) enragedTimer = Math.max(enragedTimer, e.enragedLabelTimer);
    }
    if (enragedTimer > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, enragedTimer / 0.5);
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ENRAGED', config.width / 2, config.height / 2 - 20);
      ctx.restore();
    }

    // 闪电：屏幕瞬间变亮，0.1 秒内淡出
    if (lightningFlashRemain > 0) {
      const alpha = (lightningFlashRemain / 0.1) * 0.35;
      ctx.fillStyle = `rgba(240, 248, 255, ${alpha})`;
      ctx.fillRect(-20, -20, config.width + 40, config.height + 40);
    }

    // 连击 3+ 时触发的短白闪
    if (comboFlashRemain > 0) {
      const base = comboFlashRemain > 0.08 ? 0.2 : 0.05; // 兼容 0.05s 终结段短闪
      const alpha = (comboFlashRemain / base) * 0.45;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(-20, -20, config.width + 40, config.height + 40);
    }

    // 敌人血量策略切换提示：轻微红闪
    if (hpStrategyFlashRemain > 0) {
      const alpha = (hpStrategyFlashRemain / 0.12) * 0.22;
      ctx.fillStyle = `rgba(255, 64, 64, ${alpha})`;
      ctx.fillRect(-20, -20, config.width + 40, config.height + 40);
    }

    if (perfectBlockFlashRemain > 0) {
      const alpha = (perfectBlockFlashRemain / 0.08) * 0.35;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(-20, -20, config.width + 40, config.height + 40);
    }

    // ========== 慢动作终结技效果 ==========
    if (slowMotionTimer > 0) {
      // 1) 淡蓝色滤镜
      const alphaTint = Math.min(0.12, (slowMotionTimer / slowMotionDuration) * 0.12);
      if (alphaTint > 0) {
        ctx.fillStyle = `rgba(100, 150, 255, ${alphaTint})`;
        ctx.fillRect(-20, -20, config.width + 40, config.height + 40);
      }

      // 2) 白色冲击波（从击杀点向外扩散）
      if (slowMotionImpact) {
        const elapsed = slowMotionDuration - slowMotionTimer; // 0 -> ...
        const waveP = Math.max(0, Math.min(1, elapsed / 0.3));
        if (waveP > 0) {
          const radius = 20 + 30 * waveP;
          const waveAlpha = (1 - waveP) * 0.75;
          ctx.save();
          ctx.globalAlpha = waveAlpha;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(slowMotionImpact.x, slowMotionImpact.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3) Boss 击杀终结文案
      if (slowMotionFinishIsBoss) {
        const elapsed = slowMotionDuration - slowMotionTimer;
        const p = Math.max(0, Math.min(1, elapsed / slowMotionDuration));
        const scale = 0.75 + 0.5 * p;
        ctx.save();
        ctx.translate(config.width / 2, config.height / 2);
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.max(0, Math.min(1, slowMotionTimer / 1.2));
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = 'rgba(255, 200, 60, 0.8)';
        ctx.shadowBlur = 18;
        ctx.font = 'bold 40px system-ui, sans-serif';
        ctx.fillText('FINISH!', 0, 0);
        ctx.restore();
      }
    }

    // Boss 登场：短暂暗屏
    if (bossIntroDarkTimer > 0) {
      const alpha = Math.min(1, bossIntroDarkTimer / 0.25) * 0.85;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(-20, -20, config.width + 40, config.height + 40);
    }

    // 玩家死亡：从正常逐渐变暗到全黑（双人时仅当两人均已阵亡才暗屏，避免 P1 死后 P2 看不见）
    const coopBothDeadDraw =
      isCoopMode && player.state === 'dead' && player2.state === 'dead';
    const showDeathDarkOverlay =
      deathDarkTimer > 0 &&
      player.state === 'dead' &&
      (!isCoopMode || coopBothDeadDraw);
    if (showDeathDarkOverlay) {
      const fadeDuration = 2; // 0~2 秒渐暗
      const p = Math.min(1, deathDarkTimer / fadeDuration); // 0~1
      const alpha = p * 1.0; // 最暗到全黑 1.0
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(-20, -20, config.width + 40, config.height + 40);

      // 全黑后显示 YOU DIED 文本（英文版的“你死了”）
      if (deathDarkTimer >= fadeDuration) {
        const textFadeDuration = 1; // 文本淡入 1 秒
        const textT = Math.min(1, (deathDarkTimer - fadeDuration) / textFadeDuration);
        ctx.save();
        ctx.globalAlpha = textT;
        ctx.fillStyle = '#f5f5f5';
        ctx.font = 'bold 40px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('YOU DIED', config.width / 2, config.height / 2);
        ctx.restore();
      }
    }

    // Boss 登场：字幕 THE ABOMINATION
    if (bossIntroLabelTimer > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, bossIntroLabelTimer / 0.4);
      ctx.fillStyle = '#c62828';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE ABOMINATION', config.width / 2, config.height / 2 - 20);
      ctx.restore();
    }

    // 右上角连击显示（X>1 时显示）
    if (player.combo > 1) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.fillRect(config.width - 170, 12, 158, 42);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(config.width - 170, 12, 158, 42);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Combo: ${player.combo}`, config.width - 160, 40);
      ctx.restore();
    }

    // 连招进度指示器（只在连招中显示）
    if (player.comboStep > 0 && player.comboTimer > 0) {
      const dotColors = ['#ffffff', '#60a5fa', '#fbbf24'];
      const dotY = config.height - 30;
      const dotStartX = config.width / 2 - 24;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(dotStartX - 16, dotY - 10, 80, 20);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(dotStartX - 16, dotY - 10, 80, 20);

      for (let i = 0; i < 3; i++) {
        const dx = dotStartX + i * 24;
        const active = i < player.comboStep;
        const current = i === player.comboStep - 1;
        const r = current ? 6 : active ? 4.5 : 4;

        ctx.beginPath();
        ctx.arc(dx, dotY, r, 0, Math.PI * 2);

        if (active) {
          ctx.fillStyle = dotColors[i];
          ctx.fill();
          if (current) {
            ctx.save();
            ctx.shadowColor = dotColors[i];
            ctx.shadowBlur = 10;
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(dx, dotY, 10, 0, Math.PI * 2);
            ctx.fillStyle = dotColors[i];
            ctx.fill();
            ctx.restore();
          }
        } else {
          ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
          ctx.fill();
        }
      }

      ctx.restore();
    }

    if (!useExternalTouchHud) {
    // 左下：神阶技能（G） 右下：闪 / J / L / K
      const R = getGameplayHudRects();
      if (!isVersusMode) {
      const tier = getCurrentGodSkillTier();
      const hasGod = !!tier;
      const gPulse = 0.7 + Math.sin(performance.now() / 1000 * 4) * 0.06;
      const gHeld = isGodSkillInputHeld();

      ctx.save();
      hudFillRoundRect(ctx, R.god.x, R.god.y, R.god.w, R.god.h, 12);
      const gg = ctx.createLinearGradient(R.god.x, R.god.y, R.god.x + R.god.w, R.god.y + R.god.h);
      if (gHeld && hasGod) {
        if (tier === 'martial') {
          gg.addColorStop(0, 'rgba(118, 76, 18, 0.96)');
          gg.addColorStop(0.5, 'rgba(22, 78, 99, 0.94)');
          gg.addColorStop(1, 'rgba(20, 24, 32, 0.97)');
        } else if (tier === 'ronin') {
          gg.addColorStop(0, 'rgba(110, 62, 38, 0.96)');
          gg.addColorStop(0.5, 'rgba(72, 42, 24, 0.94)');
          gg.addColorStop(1, 'rgba(38, 22, 12, 0.97)');
        } else if (tier === 'thor') {
          gg.addColorStop(0, 'rgba(120, 28, 52, 0.96)');
          gg.addColorStop(0.45, 'rgba(72, 14, 32, 0.94)');
          gg.addColorStop(1, 'rgba(36, 8, 18, 0.97)');
        } else if (tier === 'berserker') {
          gg.addColorStop(0, 'rgba(130, 22, 22, 0.96)');
          gg.addColorStop(1, 'rgba(48, 6, 10, 0.96)');
        } else if (tier === 'angel') {
          gg.addColorStop(0, 'rgba(110, 36, 88, 0.95)');
          gg.addColorStop(1, 'rgba(42, 14, 58, 0.96)');
        } else if (tier === 'demon') {
          gg.addColorStop(0, 'rgba(124, 32, 36, 0.95)');
          gg.addColorStop(1, 'rgba(48, 12, 28, 0.96)');
        }
      } else if (hasGod) {
        gg.addColorStop(0, `rgba(28, 52, 88, ${0.9 * gPulse})`);
        gg.addColorStop(1, 'rgba(10, 18, 36, 0.95)');
      } else {
        gg.addColorStop(0, 'rgba(36, 38, 48, 0.58)');
        gg.addColorStop(1, 'rgba(20, 22, 30, 0.65)');
      }
      ctx.fillStyle = gg;
      ctx.fill();
      let godStroke = 'rgba(71, 85, 105, 0.45)';
      if (gHeld && hasGod) {
        if (tier === 'martial') godStroke = 'rgba(253, 230, 138, 0.98)';
        else if (tier === 'ronin') godStroke = 'rgba(222, 184, 135, 0.98)';
        else if (tier === 'thor') godStroke = 'rgba(252, 165, 165, 0.98)';
        else if (tier === 'berserker') godStroke = 'rgba(254, 202, 202, 0.98)';
        else if (tier === 'angel') godStroke = 'rgba(230, 190, 255, 0.96)';
        else if (tier === 'demon') godStroke = 'rgba(251, 146, 120, 0.96)';
      } else if (hasGod) {
        if (player.godRageActive && tier === 'martial') godStroke = 'rgba(103, 232, 249, 0.92)';
        else if (player.godThorMoveActive && tier === 'thor') godStroke = 'rgba(125, 211, 252, 0.9)';
        else if (player.godRageActive && tier === 'ronin') godStroke = 'rgba(248, 113, 113, 0.9)';
        else if (player.godRageActive && tier === 'berserker') godStroke = 'rgba(248, 113, 113, 0.9)';
        else if (player.godAngelSummonActive && tier === 'angel') godStroke = 'rgba(253, 224, 138, 0.9)';
        else if (player.godDemonFlyRemain > 0 && tier === 'demon') godStroke = 'rgba(192, 132, 252, 0.88)';
        else godStroke = 'rgba(56, 189, 248, 0.78)';
      }
      ctx.strokeStyle = godStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.textAlign = 'center';
      const label = getGodSkillButtonLabel();
      ctx.font = '600 13px system-ui, "PingFang SC", "Heiti SC", sans-serif';
      ctx.fillStyle = hasGod ? '#f8fafc' : 'rgba(148, 163, 184, 0.88)';
      if (label.length <= 12) {
        ctx.fillText(label, R.god.x + R.god.w / 2, R.god.y + 22);
      } else {
        const cut = Math.min(10, Math.floor(label.length / 2));
        ctx.fillText(label.slice(0, cut), R.god.x + R.god.w / 2, R.god.y + 17);
        ctx.fillText(label.slice(cut), R.god.x + R.god.w / 2, R.god.y + 32);
      }
      ctx.font = '600 11px system-ui, sans-serif';
      const demonFlyingHud = demonMode && player.godDemonFlyRemain > 0;
      if (demonFlyingHud) {
        ctx.fillStyle = 'rgba(237, 214, 255, 0.98)';
        ctx.fillText(
          `飞行 ${Math.ceil(player.godDemonFlyRemain)}s`,
          R.god.x + R.god.w / 2,
          R.god.y + R.god.h - 9
        );
      } else {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.92)';
        ctx.fillText(hasGod ? 'G 键 · 点击' : '未解锁神阶', R.god.x + R.god.w / 2, R.god.y + R.god.h - 9);
      }
      ctx.textAlign = 'left';
      ctx.restore();
      }

      const dodgeCd = Math.max(0, player.dodgeCooldown || 0);
      const dodgeReady = dodgeCd <= 0;
      const cdMs = Math.max(0, player.superAttackCooldown || 0);
      const kReady = cdMs <= 0;

      drawHudActionButton(ctx, R.dodge, {
        main: '闪',
        sub: '左Shift',
        ready: dodgeReady,
        accent: '#38bdf8',
        base: 'cyan',
      });
      if (!dodgeReady) {
        ctx.save();
        hudFillRoundRect(ctx, R.dodge.x, R.dodge.y, R.dodge.w, R.dodge.h, 12);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText(String(Math.ceil(dodgeCd)), R.dodge.x + R.dodge.w / 2, R.dodge.y + R.dodge.h / 2 + 6);
        ctx.textAlign = 'left';
        ctx.restore();
      }

      drawHudActionButton(ctx, R.j, {
        main: 'J',
        sub: '攻击',
        ready: true,
        accent: '#818cf8',
        base: 'violet',
      });
      drawHudActionButton(ctx, R.l, {
        main: 'L',
        sub: '格挡',
        ready: true,
        accent: '#94a3b8',
        base: 'slate',
      });

      const kr = R.k;
      ctx.save();
      hudFillRoundRect(ctx, kr.x, kr.y, kr.w, kr.h, 12);
      const kg = ctx.createLinearGradient(kr.x, kr.y, kr.x, kr.y + kr.h);
      kg.addColorStop(0, kReady ? '#5c3d0a' : '#3d2908');
      kg.addColorStop(1, '#1a1206');
      ctx.fillStyle = kg;
      ctx.fill();
      ctx.strokeStyle = kReady ? '#fbbf24' : 'rgba(148, 163, 184, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      hudFillRoundRect(ctx, kr.x, kr.y, kr.w, kr.h, 12);
      ctx.clip();
      if (
        superAttackSprite &&
        superAttackSprite.complete &&
        superAttackSprite.naturalWidth >= player.superAttackFrameWidth
      ) {
        ctx.drawImage(
          superAttackSprite,
          0, 0,
          player.superAttackFrameWidth, player.superAttackFrameHeight,
          kr.x + 2, kr.y + 2, kr.w - 4, kr.h - 4
        );
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fcd34d';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.fillText('K', kr.x + kr.w / 2, kr.y + kr.h / 2 + 6);
        ctx.textAlign = 'left';
      }
      ctx.restore();
      ctx.textAlign = 'center';
      ctx.font = '600 10px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
      ctx.fillText(tr('hud_super'), kr.x + kr.w / 2, kr.y + kr.h - 6);
      ctx.textAlign = 'left';
      if (!kReady) {
        ctx.save();
        hudFillRoundRect(ctx, kr.x, kr.y, kr.w, kr.h, 12);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 17px system-ui, sans-serif';
        ctx.fillText(String(Math.ceil(cdMs / 1000)), kr.x + kr.w / 2, kr.y + kr.h / 2 + 5);
        ctx.textAlign = 'left';
        ctx.restore();
      }
      ctx.restore();
    }

    ctx.restore();

    if (gameState === 'playing' && isVersusMode) drawVersusOverlay(ctx);

    if (controlsHelpOpen) {
      drawControlsHelpOverlay();
    }
  }

  const CONTROLS_LINES_P1_ZH = [
    'A / D：左右移动',
    'W：跳跃',
    'J：普通攻击（三段连招）',
    'K：超级拳',
    'L：格挡',
    '左 Shift：冲刺闪避（配合 A / D；不按方向则朝当前朝向）',
    'G：神阶专属技能',
    'F：紧急回血（每局 4 次）',
    'H / P：碰撞框调试',
    'ESC：暂停',
  ];
  const CONTROLS_LINES_P1_EN = [
    'A / D: move',
    'W: jump',
    'J: attack (3-hit combo)',
    'K: super punch',
    'L: block',
    'Left Shift: dodge dash (with A/D; no input = facing)',
    'G: god-tier skill',
    'F: emergency heal (4 per run)',
    'H / P: hitbox debug',
    'ESC: pause',
  ];
  const CONTROLS_LINES_P2_ZH = [
    '← / →：左右移动',
    '↑：跳跃',
    'B：普通攻击（三段连招）',
    'N：超级拳',
    'M：格挡',
    '右 Shift：冲刺闪避（配合方向键；不按方向则朝当前朝向）',
    'C：神阶专属技能',
    'V：紧急回血（每局 4 次）',
  ];
  const CONTROLS_LINES_P2_EN = [
    '← / →: move',
    '↑: jump',
    'B: attack (3-hit combo)',
    'N: super punch',
    'M: block',
    'Right Shift: dodge dash (with arrows; no input = facing)',
    'C: god-tier skill',
    'V: emergency heal (4 per run)',
  ];
  function getControlsLinesP1() {
    return gameLocale === 'en' ? CONTROLS_LINES_P1_EN : CONTROLS_LINES_P1_ZH;
  }
  function getControlsLinesP2() {
    return gameLocale === 'en' ? CONTROLS_LINES_P2_EN : CONTROLS_LINES_P2_ZH;
  }

  function drawControlsHelpTextBlock(ctx, title, color, lines, x, y, lineGap) {
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    ctx.font = 'bold 22px system-ui, "PingFang SC", "Heiti SC", sans-serif';
    ctx.fillText(title, x, y);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px system-ui, "PingFang SC", "Heiti SC", sans-serif';
    let ly = y + 32;
    for (const line of lines) {
      ctx.fillText(line, x, ly);
      ly += lineGap;
    }
    return ly;
  }

  /** 全屏按键说明：splitCoop 为 true 时左右分栏 P1 / P2 */
  function drawFullScreenControlsHelp(ctx, splitCoop, footerText) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
    ctx.fillRect(0, 0, config.width, config.height);

    const pad = 36;
    const top = 56;
    const lineGap = 28;
    if (splitCoop) {
      const mid = config.width / 2;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mid, top - 24);
      ctx.lineTo(mid, config.height - 72);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 28px system-ui, "PingFang SC", "Heiti SC", sans-serif';
      ctx.fillText(tr('controls_title'), config.width / 2, top - 8);

      drawControlsHelpTextBlock(ctx, tr('controls_p1'), '#93c5fd', getControlsLinesP1(), pad, top + 28, lineGap);
      drawControlsHelpTextBlock(ctx, tr('controls_p2'), '#fca5a5', getControlsLinesP2(), mid + pad, top + 28, lineGap);
    } else {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 28px system-ui, "PingFang SC", "Heiti SC", sans-serif';
      ctx.fillText(tr('controls_title'), config.width / 2, top);
      const boxW = Math.min(520, config.width - pad * 2);
      const x0 = (config.width - boxW) / 2;
      drawControlsHelpTextBlock(ctx, tr('controls_ops'), '#94a3b8', getControlsLinesP1(), x0, top + 40, lineGap);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fca5a5';
    ctx.font = '16px system-ui, "PingFang SC", "Heiti SC", sans-serif';
    ctx.fillText(footerText, config.width / 2, config.height - 40);
    ctx.restore();
  }

  /** 开局暂停时的按键说明 */
  function drawControlsHelpOverlay() {
    drawFullScreenControlsHelp(ctx, controlsHelpIsCoop, tr('controls_close_game'));
  }

  function drawMenuOptions() {
    const titleY = 88 + Math.sin(menuFloatTime * 2.2) * 6;
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(tr('opt_title'), config.width / 2, titleY);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(tr('opt_nav'), config.width / 2, titleY + 28);

    const rows = [
      {
        label: `${tr('opt_language')}：${gameLocale === 'zh' ? tr('opt_lang_zh') : tr('opt_lang_en')}`,
        hint: tr('opt_hint_lang'),
      },
      {
        label: `${tr('opt_friendly_fire')}：${coopFriendlyFireEnabled ? tr('opt_on') : tr('opt_off')}`,
        hint: tr('opt_hint_ff'),
      },
      { label: tr('opt_back'), hint: '' },
    ];
    let y = titleY + 72;
    const rowH = 56;
    for (let i = 0; i < rows.length; i++) {
      const sel = i === menuOptionIndex;
      if (sel) {
        ctx.fillStyle = 'rgba(192, 57, 43, 0.2)';
        ctx.fillRect(config.width / 2 - 200, y - 28, 400, rowH - 8);
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.strokeRect(config.width / 2 - 200, y - 28, 400, rowH - 8);
      }
      ctx.fillStyle = sel ? '#ffffff' : '#cbd5e1';
      ctx.font = sel ? 'bold 22px system-ui, sans-serif' : '20px system-ui, sans-serif';
      ctx.fillText(rows[i].label, config.width / 2, y);
      if (rows[i].hint) {
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillStyle = sel ? '#94a3b8' : '#64748b';
        ctx.fillText(rows[i].hint, config.width / 2, y + 22);
      }
      y += rowH + (rows[i].hint ? 10 : 0);
    }

    ctx.textAlign = 'center';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    const ffNote = tr('opt_ff_hint');
    wrapFillCenteredLines(ctx, ffNote, config.width / 2, config.height - 72, 420, 20);
  }

  /** 多行居中说明（不换行单词，按字符宽度简单折行） */
  function wrapFillCenteredLines(ctx, text, cx, startY, maxW, lineGap) {
    if (!text) return;
    const lines = [];
    let line = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    let y = startY - (lines.length - 1) * lineGap;
    for (const ln of lines) {
      ctx.fillText(ln, cx, y);
      y += lineGap;
    }
  }

  function drawMenuCoopSub() {
    const titleY = 88 + Math.sin(menuFloatTime * 2.2) * 6;
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(tr('coop_sub_title'), config.width / 2, titleY);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(tr('coop_sub_nav'), config.width / 2, titleY + 28);

    const labels = [tr('coop_sub_versus'), tr('coop_sub_coop')];
    let y = titleY + 78;
    const rowH = 56;
    for (let i = 0; i < labels.length; i++) {
      const sel = i === menuCoopSubIndex;
      if (sel) {
        ctx.fillStyle = 'rgba(192, 57, 43, 0.2)';
        ctx.fillRect(config.width / 2 - 220, y - 26, 440, rowH - 6);
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.strokeRect(config.width / 2 - 220, y - 26, 440, rowH - 6);
      }
      ctx.fillStyle = sel ? '#ffffff' : '#cbd5e1';
      ctx.font = sel ? 'bold 22px system-ui, sans-serif' : '20px system-ui, sans-serif';
      ctx.fillText(labels[i], config.width / 2, y);
      y += rowH + 8;
    }
  }

  function drawMenu() {
    ctx.clearRect(0, 0, config.width, config.height);
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, config.width, config.height);

    for (const p of menuAshParticles) {
      ctx.fillStyle = `rgba(255, 140, 80, ${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, config.groundY + 0.5);
    ctx.lineTo(config.width, config.groundY + 0.5);
    ctx.stroke();

    const titleY = 78 + Math.sin(menuFloatTime * 2.2) * 8;
    ctx.textAlign = 'center';
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.shadowColor = 'rgba(192, 57, 43, 0.8)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(tr('title_main'), config.width / 2, titleY);
    ctx.shadowBlur = 0;

    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillStyle = '#c0392b';
    ctx.fillText('ZOMBIE BOXING', config.width / 2, titleY + 34);

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(tr('menu_rank', enemyClearRank), config.width / 2, titleY + 56);

    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(config.width / 2 - 110, titleY + 52);
    ctx.lineTo(config.width / 2 + 110, titleY + 52);
    ctx.stroke();

    if (menuOptionsOpen) {
      drawMenuOptions();
    } else if (menuCoopSubOpen) {
      drawMenuCoopSub();
    } else {
      const menuItems = getMainMenuItemLabels();
      const startY = titleY + 88;
      for (let i = 0; i < menuItems.length; i++) {
        const y = startY + i * 52;
        const selected = i === menuSelectedIndex;
        if (selected) {
          ctx.fillStyle = 'rgba(192, 57, 43, 0.22)';
          ctx.fillRect(config.width / 2 - 140, y - 30, 280, 42);
          ctx.strokeStyle = '#c0392b';
          ctx.lineWidth = 2;
          ctx.strokeRect(config.width / 2 - 140, y - 30, 280, 42);
          ctx.fillStyle = '#ffb4aa';
          ctx.font = 'bold 26px system-ui, sans-serif';
          ctx.fillText('>', config.width / 2 - 118, y);
        }
        ctx.fillStyle = selected ? '#ffffff' : '#cbd5e1';
        ctx.font = selected ? 'bold 28px system-ui, sans-serif' : '24px system-ui, sans-serif';
        ctx.fillText(menuItems[i], config.width / 2 + 10, y);
      }
    }

    const foot = menuOptionsOpen
      ? ''
      : menuCoopSubOpen
        ? tr('coop_sub_hint')
        : `${tr('menu_nav_hint')} · ${tr('menu_help_note')}`;
    if (foot) {
      const pulse = 0.55 + (Math.sin(menuHintPulseTime * 3) + 1) * 0.2;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText(foot, config.width / 2, config.height - 36);
      ctx.globalAlpha = 1;
    }

    if (menuShowHelp) {
      drawFullScreenControlsHelp(ctx, true, tr('controls_close_menu'));
    }
  }

  function drawPause() {
    draw();
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px system-ui, sans-serif';
    ctx.fillText(tr('pause_title'), config.width / 2, config.height / 2 - 20);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText(tr('pause_resume'), config.width / 2, config.height / 2 + 30);
    ctx.restore();
  }

  // ========== 游戏主循环 ==========
  let lastTime = performance.now();
  function loop() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    try {
      if (gameState === 'menu') {
        menuFloatTime += dt;
        menuHintPulseTime += dt;
        for (const p of menuAshParticles) {
          p.y += p.vy * dt;
          p.x += p.vx * dt + Math.sin((menuFloatTime + p.y * 0.01) * 1.3) * 0.12;
          if (p.y > config.height + 8) {
            p.y = -8;
            p.x = Math.random() * config.width;
          }
          if (p.x < -6) p.x = config.width + 6;
          else if (p.x > config.width + 6) p.x = -6;
        }
        drawMenu();
      } else if (gameState === 'paused') {
        drawPause();
      } else if (gameState === 'settlement') {
        draw();
      } else {
        let dtSim = dt;
        if (slowMotionTimer > 0) {
          // 慢动作：用真实 dt 递减计时，但用缩放后的 dt 影响更新/动画
          slowMotionTimer -= dt;
          if (slowMotionTimer <= 0) {
            slowMotionTimer = 0;
            slowMotionScale = 1;
            slowMotionImpact = null;
            slowMotionFinishIsBoss = false;
          } else {
            // 慢动作后半段逐步恢复
            if (slowMotionTimer < 0.5) {
              slowMotionScale = 0.15 + (1 - 0.15) * (1 - slowMotionTimer / 0.5);
            } else {
              slowMotionScale = 0.15;
            }
            dtSim = dt * slowMotionScale;
          }
        }

        if (!controlsHelpOpen) {
          update(dtSim);
        }
        draw();
      }
    } catch (err) {
      // 防止单帧异常导致循环停止（白屏卡死）
      console.error('Loop render/update error:', err);
      try {
        // 轻量级降级渲染，至少保证玩家和敌人可见
        ctx.clearRect(0, 0, config.width, config.height);
        ctx.fillStyle = '#0b1026';
        ctx.fillRect(0, 0, config.width, config.height);
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, config.groundY + 0.5);
        ctx.lineTo(config.width, config.groundY + 0.5);
        ctx.stroke();
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(player.x, player.y, config.playerWidth, config.playerHeight);
        for (const enemy of enemies) {
          if (enemy.hp <= 0) continue;
          ctx.fillStyle = enemy.isBoss ? '#f97316' : '#ef4444';
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      } catch (_) {
        // 忽略降级渲染错误，继续保活循环
      }
    } finally {
      requestAnimationFrame(loop);
    }
  }

  (async function start() {
    await initSpriteAnimators();
    requestAnimationFrame(loop);
  })();
})();
