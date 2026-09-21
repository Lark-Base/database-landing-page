/**
 * 页面交互入口
 * ------------------------------------------------------------------
 * 1. hero 打字机 + 预览卡片轮播（共用同一条时间轴）
 * 2. 对比表：宽屏表格 / 窄屏卡片
 * 3. 滚动淡入
 * 4. 表格滚动渐隐
 * 5. ASCII 拖尾背景
 */

import { createAsciiTrail } from './ascii-trail.js';

/* ================= 数据 ================= */

const SCENES = [
  { prompt: '搭一个个人效率工作台，管理任务和专注记录', image: 'hero-personal-workspace-original.jpg', name: '个人工作台' },
  { prompt: '搭一套 CRM 销售工作台，统一管理客户和商机跟进', image: 'hero-crm-workspace-original.jpg', name: 'CRM 销售工作台' },
  { prompt: '做一套 AI 智能排班系统，自动生成员工排班表', image: 'hero-ai-scheduling-original.jpg', name: 'AI 排班系统' },
  { prompt: '做一个智能家居素材平台，把商品变成内容矩阵', image: 'hero-smart-home-original.jpg', name: '智居营销工作台' },
];

// 单个场景的时间轴（毫秒）
const LEAD_IN = 100;        // 开始打字前的停顿
const TYPING = 600;         // 打字时长
const HOLD = 2300;          // 打完后的停留
const FADE_OUT = 120;       // 淡出
const TYPED_END = LEAD_IN + TYPING;
const SCENE_DURATION = TYPED_END + HOLD + FADE_OUT;
const SWITCH_WINDOW = 760;  // 卡片切换动画窗口

const CASE_PROMPTS = {
  "ai-scheduling": "请基于多维表格数据库搭建一个 AI 智能排班系统，供门店或服务团队管理员工、班次和工时。\n\n系统包含员工管理、班次配置、排班日历、请假调班和工时统计。管理员可维护员工技能、可上班时间、时薪及每周工时上限，按日期或周期生成排班，并通过拖拽调整班次；员工可查看个人排班并提交请假或调班申请。\n\n自动检查时间冲突、岗位缺口、连续工作和工时超限，异常项高亮提醒；排班调整后实时更新员工总工时及预计成本。所有数据写入多维表格，预置示例员工和班次，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force",
  "smart-home": "请基于多维表格数据库搭建一个智能家居素材管理平台，供内容营销团队统一管理商品、素材和内容生产任务。\n\n系统包含商品库、素材库、内容生成、审核发布和数据看板。用户可维护商品卖点、规格和适用场景，上传图片、视频及文案素材，按商品、渠道、内容类型和使用状态搜索筛选；支持从商品信息生成不同平台的标题、短文案和内容草稿，并关联使用的素材。\n\n内容需经过草稿、待审核、已通过、已发布的状态流转，自动检查必填信息和素材缺失，记录负责人、修改历史及发布时间。预置示例商品和素材，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force",
  "crm": "请基于多维表格数据库搭建一个 CRM 销售工作台，供销售团队统一管理客户、联系人、商机和跟进记录。\n\n系统包含客户列表、商机看板、跟进日历、任务提醒和销售数据看板。销售可录入客户信息，关联联系人与商机，记录电话、拜访和会议纪要，并按负责人、行业、商机阶段、预计金额和下次跟进时间筛选；商机支持从线索、沟通、方案、谈判到赢单或输单的状态流转。\n\n系统自动提醒逾期跟进和长期未联系客户，汇总销售漏斗、预计收入、赢单率及个人业绩。所有修改实时写回多维表格，预置示例数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force",
  "productivity": "请基于多维表格数据库搭建一个个人效率工作台，用来统一管理待办、项目、专注记录和每周复盘。\n\n系统包含今日视图、待办清单、项目看板、专注计时和复盘统计。用户可快速新增待办，设置项目、优先级、状态、截止日期和预估耗时，按项目、状态、标签筛选；项目看板展示各项目进度和关联任务完成情况，专注记录自动累计到对应任务和项目。\n\n待办完成时自动记录完成时间，逾期任务高亮提醒，项目进度按关联任务完成比例计算；统计本周完成数、投入时间和逾期率。预置示例数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
};

const TEMPLATES = [
  {
    "name": "轻量 ERP（进销存）",
    "prompt": "请基于多维表格数据库搭建一个轻量 ERP 进销存系统，供小型贸易或零售团队管理商品、库存、采购和销售。\n\n系统包含商品档案、供应商与客户、采购单、销售单、出入库记录和经营看板。用户可创建采购及销售单，添加商品、数量、单价、折扣和经办人，提交后进入待审核、已确认、已入库或已出库等状态；库存页按仓库和商品查看现存量、可用量及流水。\n\n采购入库自动增加库存，销售出库自动扣减，库存不足禁止出库，低库存触发提醒；看板统计销售额、毛利、库存金额和热销商品。预置示例数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "需求中心",
    "prompt": "请基于多维表格数据库搭建一个需求中心，供产品、设计和研发团队集中收集、评估和推进需求。\n\n系统包含需求收集、需求池、评审排期、迭代看板和进度统计。用户可提交需求并填写背景、目标、提出人、优先级、期望上线时间和验收标准；需求经过待评审、已排期、开发中、已上线、已关闭等状态流转，可按优先级、状态、负责人和迭代筛选，迭代看板展示各版本的需求分布和完成情况。\n\n状态变更自动记录时间和操作人，逾期需求和高优先级需求高亮提醒，迭代进度按关联需求完成比例计算。预置示例需求，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "招聘管理",
    "prompt": "请基于多维表格数据库搭建一个招聘管理系统，供 HR 和面试官统一管理职位、候选人和面试流程。\n\n系统包含职位管理、候选人库、招聘漏斗、面试日程和数据看板。HR 可维护职位要求、编制、负责人和招聘状态，录入候选人简历、来源、意向职位及联系方式，并推动候选人经过筛选、初试、复试、Offer、入职或淘汰等阶段；面试官可查看待办面试并提交评分与评价。\n\n系统自动提醒临近面试、长时间未跟进和 Offer 待确认事项，统计各渠道候选人数、阶段转化率、招聘周期及职位完成率。预置示例数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "生产监控",
    "prompt": "请基于多维表格数据库搭建一个生产监控系统，供车间或生产团队跟踪工单、产量、设备和质量异常。\n\n系统包含生产工单、报工记录、设备台账、异常报修和生产看板。用户可创建工单，设置产品、计划数量、计划工期和负责人，工人按班次报工记录实际产量和工时；设备台账记录状态和保养计划，异常可提交报修并流转处理。\n\n系统自动汇总工单完成进度、达成率、良品率和设备稼动率，计划延期、良率过低或设备停机时高亮预警。预置示例数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "活动报名",
    "prompt": "请基于多维表格数据库搭建一个活动报名系统，供活动主办方管理活动、报名和签到。\n\n系统包含活动列表、报名表单、报名管理、签到记录和数据看板。主办方可创建活动，设置时间、地点、名额、报名截止时间和报名字段；参与者通过表单提交报名，主办方按活动、报名状态和签到状态筛选名单，并在现场标记签到。\n\n系统自动统计各活动报名人数、剩余名额、签到率和报名趋势，名额报满自动停止报名，临近截止时间高亮提醒。预置示例活动和报名数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "个人待办",
    "prompt": "请基于多维表格数据库搭建一个个人待办工具，帮助个人集中管理任务、项目和日程。\n\n系统包含今日视图、待办清单、项目分组和统计页。用户可快速新增待办，设置项目、优先级、状态、截止时间和标签，支持搜索、筛选、排序和批量完成；项目分组展示各项目下的任务和完成情况，今日视图突出今天到期和已逾期的任务。\n\n待办完成时自动记录完成时间，逾期任务高亮提醒，统计本周完成数量、逾期率和各项目投入分布。预置示例数据，所有修改实时写回多维表格，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "阅读记录",
    "prompt": "请基于多维表格数据库搭建一个阅读记录工具，供个人管理书单、阅读进度和读书笔记。\n\n系统包含书架、阅读详情、笔记页和阅读统计。用户可添加书籍，记录书名、作者、分类、总页数、阅读状态和评分，按分类、状态和关键词筛选；阅读详情页可更新当前页数并自动计算进度，选中章节可记录读书笔记和摘抄，笔记页按书籍归档。\n\n系统自动根据当前页数更新阅读进度，读完自动标记状态并记录完成日期，统计本月读完本数、累计阅读量和分类分布。预置示例书籍，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  }
];

const COMPARISON_COLUMNS = ['Excel 手工管理', '自建开发', '传统低代码', '多维表格数据库 CLI × AI'];
const COMPARISON_ROWS = [
  ['上手方式', '人人会，但全靠自觉', '需要工程团队', '要学平台概念', '自然语言对话'],
  ['搭建周期', '—', '以周 / 月计', '以天计', '以分钟计'],
  ['服务器 / 数据库', '单机文件', '自购自维', '平台托管', '免 · 数据即多维表格'],
  ['协作与可视化', '靠文件转发', '另做管理后台', '平台内建', '多人协作 + 仪表盘原生'],
  ['账号与权限', '几乎没有', '自建账号体系', '平台账号', '飞书身份与权限直接复用'],
  ['后续迭代', '手工改', '等排期', '拖拽重配', '跟 AI 说一句话'],
];
// 窄屏折叠态只展示这三行
const COMPACT_ROWS = [COMPARISON_ROWS[1], COMPARISON_ROWS[2], COMPARISON_ROWS[5]];

/* ================= hero 轮播 ================= */

function initHero() {
  const demand = document.querySelector('.hero-demand');
  const typing = document.querySelector('.demand-typing');
  const preview = document.querySelector('.hero-preview');
  const stage = document.querySelector('.fan-stage');
  const heroContent = document.querySelector('.hero-content');
  // 提示词容器已移除，demand / typing 可能不存在；扇形轮播不依赖它们
  if (!preview || !stage || !heroContent) return;

  // 前两个是装饰性纸张，后面才是图片卡
  const cards = [...stage.querySelectorAll('.fan-card')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let rafId = 0;
  let elapsed = 0;
  let lastNow = 0;
  let visible = true;
  let lastKey = '';
  let currentSceneIndex = -1;

  /** 打字机：只在场景切换时重建 DOM，之后仅切 class */
  const renderTyping = (sceneIndex, count) => {
    if (!typing) return;
    if (sceneIndex !== currentSceneIndex) {
      currentSceneIndex = sceneIndex;
      typing.textContent = '';
      const frag = document.createDocumentFragment();
      for (const ch of SCENES[sceneIndex].prompt) {
        const span = document.createElement('span');
        span.className = 'typed-character';
        span.textContent = ch;
        frag.appendChild(span);
      }
      typing.appendChild(frag);
    }
    const chars = typing.children;
    for (let i = 0; i < chars.length; i += 1) {
      chars[i].classList.toggle('is-visible', i < count);
    }
  };

  const apply = ({ index, imageIndex, count, fading, switching }) => {
    if (demand) {
      demand.dataset.scene = String(index);
      demand.setAttribute('aria-label', SCENES[index].prompt);
    }
    if (typing) {
      typing.dataset.visibleCharacters = String(count);
      typing.classList.toggle('is-fading', fading);
    }
    renderTyping(index, count);

    preview.dataset.imageScene = String(imageIndex);
    preview.setAttribute('aria-label', SCENES[imageIndex].name);

    // 扇形槽位：当前图在中心，前一张在左、后一张在右，其余待命
    cards.forEach((card, i) => {
      const offset = (i - imageIndex + cards.length) % cards.length;
      let slot;
      if (offset === 0) slot = 'center';
      else if (offset === 1) slot = 'right';
      else if (offset === cards.length - 1) slot = 'left';
      else slot = 'hidden';
      card.dataset.slot = slot;
      if (slot === 'center') card.setAttribute('role', 'img');
      else card.removeAttribute('role');
      card.setAttribute('aria-hidden', slot === 'center' ? 'false' : 'true');
    });
  };

  const tick = (now) => {
    if (lastNow) elapsed += now - lastNow;
    lastNow = now;

    const cycle = Math.floor(elapsed / SCENE_DURATION);
    const index = cycle % SCENES.length;
    const offset = elapsed % SCENE_DURATION;
    const prompt = SCENES[index].prompt;

    const count = Math.min(
      prompt.length,
      Math.max(0, Math.floor(((offset - LEAD_IN) / TYPING) * prompt.length)),
    );
    // 图片比文字晚一拍切换，制造错位感
    const imageIndex = cycle > 0 && offset < TYPED_END
      ? (index + SCENES.length - 1) % SCENES.length
      : index;
    const fading = offset >= TYPED_END + HOLD;
    const switching = cycle > 0 && offset >= TYPED_END && offset < TYPED_END + SWITCH_WINDOW;

    const key = `${index}:${imageIndex}:${count}:${fading}:${switching}`;
    if (key !== lastKey) {
      apply({ index, imageIndex, count, fading, switching });
      lastKey = key;
    }
    rafId = requestAnimationFrame(tick);
  };

  const sync = () => {
    cancelAnimationFrame(rafId);
    lastNow = 0;
    if (reduceMotion.matches) {
      // 降级为静态首帧
      elapsed = 0;
      lastKey = '';
      apply({ index: 0, imageIndex: 0, count: SCENES[0].prompt.length, fading: false, switching: false });
      return;
    }
    if (visible && !document.hidden) rafId = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  io.observe(heroContent);

  reduceMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
}

/* ================= 对比表 ================= */

function initComparison() {
  const host = document.querySelector('.comparison');
  if (!host) return;

  const mq = matchMedia('(max-width: 904px)');
  let expanded = false;

  const buildTable = () => {
    const shell = document.createElement('div');
    shell.className = 'table-shell';
    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    scroll.dataset.topFade = 'false';
    scroll.dataset.bottomFade = 'false';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const label of ['维度', ...COMPARISON_COLUMNS]) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    for (const row of COMPARISON_ROWS) {
      const tr = document.createElement('tr');
      row.forEach((cell, i) => {
        const el = document.createElement(i === 0 ? 'th' : 'td');
        if (i === 0) el.scope = 'row';
        el.textContent = cell;
        tr.appendChild(el);
      });
      tbody.appendChild(tr);
    }

    table.append(thead, tbody);
    scroll.appendChild(table);
    shell.appendChild(scroll);
    return shell;
  };

  const buildCards = () => {
    const frag = document.createDocumentFragment();
    const wrap = document.createElement('div');
    wrap.className = 'comparison-cards';
    wrap.id = 'comparison-cards';

    for (const row of (expanded ? COMPARISON_ROWS : COMPACT_ROWS)) {
      const article = document.createElement('article');
      article.className = 'comparison-card';
      const h4 = document.createElement('h4');
      h4.textContent = row[0];
      const dl = document.createElement('dl');
      // 结论列前置
      for (const col of [4, 1, 2, 3]) {
        const div = document.createElement('div');
        if (col === 4) div.className = 'comparison-highlight';
        const dt = document.createElement('dt');
        dt.textContent = COMPARISON_COLUMNS[col - 1];
        const dd = document.createElement('dd');
        dd.textContent = row[col];
        div.append(dt, dd);
        dl.appendChild(div);
      }
      article.append(h4, dl);
      wrap.appendChild(article);
    }

    const toggle = document.createElement('button');
    toggle.className = 'comparison-toggle';
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-controls', 'comparison-cards');
    toggle.textContent = expanded ? '收起完整对比' : '查看完整 6 项对比';
    toggle.addEventListener('click', () => {
      expanded = !expanded;
      render();
    });

    frag.append(wrap, toggle);
    return frag;
  };

  const render = () => {
    const compact = mq.matches;
    host.classList.toggle('comparison-compact', compact);
    host.textContent = '';
    host.appendChild(compact ? buildCards() : buildTable());
    if (!compact) initTableFade(host);
  };

  mq.addEventListener('change', render);
  render();
}

/** 表格上下渐隐遮罩 */
function initTableFade(scope = document) {
  for (const el of scope.querySelectorAll('.table-scroll')) {
    let timer;
    const update = () => {
      el.dataset.topFade = String(el.scrollTop > 1);
      el.dataset.bottomFade = String(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };
    const onScroll = () => {
      update();
      el.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('is-scrolling'), 700);
    };
    new ResizeObserver(update).observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
    update();
  }
}

/* ================= 滚动淡入 ================= */

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  targets.forEach((el) => {
    el.classList.add('will-reveal');
    io.observe(el);
  });
}

/* ================= ASCII 背景 ================= */

function initAsciiBackgrounds() {
  for (const el of document.querySelectorAll('[data-hover-effect="ascii-trail"]')) {
    createAsciiTrail(el);
  }
}

/* ================= Hero CTA / 复制提示词 ================= */

// 点击主 CTA 时写入剪贴板的内容
const DOUBAO_PROMPT = `请帮我安装 Lark Base Database Skill：
npx @lark-base-open/base-site-cli@latest skill install --target all --force
安装完成后，告诉我可以用多维表格数据库做什么，并给我 3 个搭建业务系统的灵感。`;

// 「复制提示词」写入剪贴板的内容（含 Lark CLI 安装）
const OTHER_AGENT_PROMPT = `请帮我在本地执行以下命令
安装 Lark CLI（已安装则跳过）
npx @larksuite/cli@latest install
安装 Lark Base Database Skill
npx @lark-base-open/base-site-cli@latest skill install --target all --force
安装完成后，告诉我可以用多维表格数据库做什么，并给我 3 个搭建业务系统的灵感。`;

const DOUBAO_URL = 'https://applink.feishu.cn/client/doubao/open?open_in=feed';

/**
 * 写剪贴板。navigator.clipboard 仅在安全上下文可用（https / localhost），
 * 其他情况回退到 execCommand。
 */
async function writeClipboard(text) {
  // 只生成标准 text/plain。当前提示词数据已经是真实换行，不再做富文本或 Unicode 替换。
  const plain = String(text)
    .replace(/\\n/g, '\n')
    .replace(/\r\n?/g, '\n');

  // 优先使用现代纯文本 API。与 execCommand 不同，它不会附带网页 HTML 剪贴板格式。
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(plain);
      return true;
    } catch {
      /* 仅在 API/权限不可用时使用 textarea 回退 */
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = plain;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';
  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, plain.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

function initHeroCta() {
  // hero 与 footer 两处主 CTA 行为完全一致
  const ARROW_SRC = './assets/74-29935-imgGroup1912054348.svg';
  const CHECK_SRC = './assets/cta-check.svg';

  const bindCta = (cta) => {
    const label = cta.querySelector('.cta-label');
    const arrow = cta.querySelector('.cta-arrow');
    const original = label.textContent;

    cta.addEventListener('click', async () => {
      if (cta.classList.contains('is-busy')) return;

      await writeClipboard(DOUBAO_PROMPT);

      // 进入「已复制，正在跳转」状态：箭头换对勾（直接切 src，兼容 Safari），省略号逐点闪烁
      cta.classList.add('is-busy');
      if (arrow) arrow.src = CHECK_SRC;
      label.textContent = '';
      label.append('提示词已复制，正在跳转');
      const dots = document.createElement('span');
      dots.className = 'cta-dots';
      for (let i = 0; i < 3; i += 1) {
        const dot = document.createElement('i');
        dot.textContent = '.';
        dots.appendChild(dot);
      }
      label.appendChild(dots);

      setTimeout(() => {
        window.open(DOUBAO_URL, '_blank', 'noopener');
        // 跳转后复位，便于再次点击
        cta.classList.remove('is-busy');
        if (arrow) arrow.src = ARROW_SRC;
        label.textContent = original;
      }, 2000);
    });
  };

  ['doubao-cta', 'footer-cta']
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .forEach(bindCta);

  // 案例卡片内的按钮：提示词取自各自的 data-prompt
  for (const btn of document.querySelectorAll('.case-build')) {
    const label = btn.textContent;
    let timer;
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('is-done')) return;
      await writeClipboard(CASE_PROMPTS[btn.dataset.case]);
      btn.classList.add('is-done');
      // 与 hero CTA 一致：文案 + 三点闪烁
      btn.textContent = '';
      btn.append('已复制，正在跳转');
      const dots = document.createElement('span');
      dots.className = 'cta-dots';
      for (let i = 0; i < 3; i += 1) {
        const dot = document.createElement('i');
        dot.textContent = '.';
        dots.appendChild(dot);
      }
      btn.appendChild(dots);
      timer = setTimeout(() => {
        window.open(DOUBAO_URL, '_blank', 'noopener');
        btn.classList.remove('is-done');
        btn.textContent = label;
      }, 2000);
    });
  }

  for (const btn of document.querySelectorAll('.case-copy-prompt')) {
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await writeClipboard(CASE_PROMPTS[btn.dataset.case]);
      if (!ok) return;
      btn.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(() => btn.classList.remove('is-copied'), 2000);
    });
  }

  const copyBtn = document.getElementById('copy-prompt');
  if (copyBtn) {
    let timer;
    copyBtn.addEventListener('click', async () => {
      const ok = await writeClipboard(OTHER_AGENT_PROMPT);
      if (!ok) return;
      copyBtn.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(() => copyBtn.classList.remove('is-copied'), 2000);
    });
  }
}

/* ================= 更多模版 ================= */

function initTemplates() {
  const tabs = [...document.querySelectorAll('.template-tabs button')];
  const panel = document.querySelector('.template-panel');
  if (!tabs.length || !panel) return;
  const pre = panel.querySelector('pre');
  const copyBtn = panel.querySelector('.icon-button');

  const select = (index) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle('selected', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${index}`);
    // 重新触发 prompt-in 动画
    pre.textContent = TEMPLATES[index].prompt;
    pre.style.animation = 'none';
    void pre.offsetWidth;
    pre.style.animation = '';
    pre.scrollTop = 0;
    updateFade();
    panel.dataset.template = String(index);
  };

  /** 顶部/底部渐隐遮罩随滚动位置切换 */
  const updateFade = () => {
    pre.dataset.topFade = String(pre.scrollTop > 1);
    pre.dataset.bottomFade = String(pre.scrollTop + pre.clientHeight < pre.scrollHeight - 1);
  };

  let scrollTimer;
  pre.addEventListener('scroll', () => {
    updateFade();
    pre.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => pre.classList.remove('is-scrolling'), 700);
  }, { passive: true });
  new ResizeObserver(updateFade).observe(pre);

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    // 左右方向键在标签间移动
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      select(next);
      tabs[next].focus();
    });
  });

  if (copyBtn) {
    let timer;
    copyBtn.addEventListener('click', async () => {
      if (copyBtn.dataset.copied === 'true') return;
      const index = Number(panel.dataset.template || 0);
      const ok = await writeClipboard(TEMPLATES[index].prompt);
      if (!ok) return;
      copyBtn.dataset.copied = 'true';
      clearTimeout(timer);
      timer = setTimeout(() => { copyBtn.dataset.copied = 'false'; }, 2000);
    });
  }

  select(0);
}

/* ================= 启动 ================= */

function boot() {
  // 各模块相互独立，单个失败不应拖垮其余初始化
  for (const [name, fn] of [
    ['hero', initHero],
    ['heroCta', initHeroCta],
    ['comparison', initComparison],
    ['reveal', initReveal],
    ['templates', initTemplates],
    ['ascii', initAsciiBackgrounds],
  ]) {
    try {
      fn();
    } catch (err) {
      console.error(`[init:${name}]`, err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
