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
  "ai-scheduling": "帮我基于飞书多维表格数据库 /lark-base-database 搭建连锁门店 AI 排班系统，以多维表格管理数据，串联排班、审批和员工反馈。\n\n主要页面和功能：\n\n* 排班日历：支持月、周视图及门店、员工筛选，查看班次详情、工时、成本和缺员情况。\n* AI 排班：用自然语言描述人数和技能需求，结合营业时间、可用时段、休假及工时限制生成草稿，支持手动调整、冲突检查和确认发布。\n* 员工管理：维护门店归属、技能、用工类型、时薪及可出勤时段，支持新增、编辑和停用。\n* 门店管理：维护营业时间、节假日和排班模板。\n* 审批待办：处理人员变更和休假申请，查看原因与进度。\n* 我的班次：查看班次、确认或拒绝出勤、申请休假及报名补班。\n\n顶部放品牌、导航和账号；主区上方展示工时、成本、缺口等指标卡，下方以大日历为核心，筛选与排班按钮置于日历工具栏。班次详情用侧边抽屉，AI 排班分步展示需求、草稿和发布。采用天空渐变、圆角卡片与清晰留白，用颜色区分班次状态，支持明暗主题和手机布局。\n\n总部管理全局，店长负责本店，员工操作本人信息。AI 草稿经人工确认发布，缺员时保留提示；操作真实保存，发布后通知员工，反馈与补班同步更新班表。提供虚构数据演示完整流程。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force",
  "smart-home": "搭建基于飞书多维表格数据库 /lark-base-database 的智能家居营销工作台，串联商品录入、AI 创作、素材修改、版本管理与下载。\n\n管理商品及不同规格 SKU，维护卖点、渠道和原图。用户通过自然语言选择商品、提供参考图，生成主图、场景图、详情图和推广文案，支持单项或整组修改，保持商品准确、品牌统一。\n\n页面与布局：\n- **首页**：顶部导航，首屏突出创作输入框和快捷任务，下方以图片卡片展示最近工作、精选素材。\n- **商品管理**：顶部搜索筛选，卡片展示商品图、名称及 SKU 数量；详情左侧预览图片，右侧编辑资料，下方管理 SKU。\n- **AI 对话**：左侧历史会话，中间消息、进度和结果卡片，底部输入框支持选择商品、添加参考图；信息不足时引导补充。\n- **素材中心**：顶部按商品、渠道、类型筛选，网格展示素材；详情按用途分组，支持多选修改、放大预览、切换历史版本、恢复和打包下载。\n- **设置**：分区维护品牌色、文案语气、目标人群及素材尺寸、风格要求。\n\n界面采用浅色背景、品牌强调色、圆角卡片和清晰留白，突出图片与主要操作，适配移动端，完善加载、空态和错误提示。\n\n数据存入多维表格，对话与页面状态同步。保留历史及部分成功结果，资料变化提示更新素材。提供示例数据。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force",
  "crm": "帮我基于飞书多维表格数据库 /lark-base-database 搭建一个销售 CRM 工作台，以多维表格存储数据，串联客户跟进、商机配置、报价与签约成交。\n\n主要页面和功能：\n\n* 销售仪表盘：用指标卡、销售漏斗和趋势图展示商机、报价、成交及转化率，按时间和负责人筛选，突出风险商机与待办。\n* 客户管理：维护客户、联系人和负责人；详情聚合关联商机、报价和订单，呈现客户跟进历程。\n* 商机配置：管理阶段、预计成交日和下一步；从产品库、套餐或常用组合选品，调整数量与优惠，自动算价并生成报价。\n* 产品管理：支持分类搜索，维护参数、价格、启停状态及套餐组合。\n* 报价与订单：支持大额审批、打印、分享和查看记录；客户确认后转正式订单，保留成交时的产品与价格。\n* 自动化任务：围绕报价到期、预计成交和客户确认生成提醒，支持分配、筛选与完成。\n* AI 助手：侧栏对话查询业务，确认后更新跟进计划或创建任务。\n\n布局采用左侧分组导航、顶部搜索与操作区；列表和详情分栏，编辑使用抽屉，报价提供整页预览。使用暖灰背景、白色卡片、细边框和低饱和强调色；金额突出、状态分色、表格紧凑易读。支持深浅主题及窄屏浏览，完善加载、空态、错误和操作反馈。页面关联跳转、数据持久保存，提供可走通销售流程的示例数据。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force",
  "productivity": "请基于多维表格数据库搭建一个个人效率工作台，用来统一管理待办、项目、专注记录和每周复盘。\n\n系统包含今日视图、待办清单、项目看板、专注计时和复盘统计。用户可快速新增待办，设置项目、优先级、状态、截止日期和预估耗时，按项目、状态、标签筛选；项目看板展示各项目进度和关联任务完成情况，专注记录自动累计到对应任务和项目。\n\n待办完成时自动记录完成时间，逾期任务高亮提醒，项目进度按关联任务完成比例计算；统计本周完成数、投入时间和逾期率。预置示例数据，完成后发布 Preview，并提供站点链接和多维表格链接。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
};

const TEMPLATES = [
  {
    "name": "轻量 ERP（进销存）",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建轻量 ERP 进销存工作台，以多维表格管理数据，串联商品、采购、库存和销售。\n\n主要页面和功能：\n\n* 经营概览：展示销售额、采购额、库存金额和毛利趋势，按时间、仓库筛选，突出低库存商品和待处理单据。\n* 商品与往来单位：维护商品编码、规格、单位、采购及销售参考价，管理供应商与客户，详情聚合库存和交易记录。\n* 采购与销售：创建单据、选择商品、调整数量及折扣，自动计算金额；支持草稿、确认、部分收发货和完成，保留确认时的价格。\n* 库存：按仓库查看现存量、占用量、可用量和出入库流水，支持分批入库、出库、调拨及盘点，记录原因与经办人。\n* 单据中心：按类型、状态和负责人筛选，查看关联单据、操作记录及打印预览；已执行单据通过退货或冲销修正。\n\n布局采用左侧业务导航、顶部搜索与新建操作；主区以紧凑表格为核心，单据编辑提供商品明细行和固定金额汇总栏，详情用抽屉展开。使用暖白背景、细边框和低饱和蓝绿色，金额右对齐、状态分色，手机端突出单据查询与收发货操作。\n\n确认订单与实际收发货分开记录，仅已执行的出入库影响现存量，重复提交不得重复扣增库存；库存不足阻止出库。按实际成本计算毛利，缺少成本时明确提示。管理员维护基础资料，采购、销售与仓库人员按职责操作。数据持久保存并同步更新，完善加载、空态、错误反馈，提供从采购入库到销售出库的虚构数据与完整流程。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "需求中心",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建团队需求中心，以多维表格管理数据，串联需求收集、评审、迭代排期和上线验收。\n\n主要页面和功能：\n\n* 工作概览：展示待评审、进行中、待验收及逾期需求，按产品、负责人和迭代筛选，查看迭代完成趋势。\n* 需求收集：填写问题背景、目标用户、预期价值、附件和验收标准，支持保存草稿、提交及查看本人需求进展。\n* 需求池：切换表格和状态看板，按优先级、来源、负责人筛选；详情记录讨论、关联需求与变更历史，支持合并重复需求并保留来源。\n* 评审与排期：记录评审结论、工作量、依赖和负责人，将通过评审的需求加入迭代；延期、退回和关闭需填写原因。\n* 迭代与验收：维护迭代目标及起止日期，跟踪开发、测试、待验收和已上线状态，逐项确认验收标准并记录上线结果。\n\n采用左侧分组导航、顶部全局搜索和提交入口，主区在列表与看板之间切换，需求详情用宽抽屉呈现背景、讨论和时间线。使用浅灰背景、白色内容区和靛蓝强调色，以克制的状态色突出优先级和阻塞项；窄屏优先支持提交、查询及评论。\n\n提交人查看本人需求，评审人与负责人推进授权范围内的流程。状态变化记录操作人和时间，阻塞及逾期项保留提醒；迭代进度按有效关联需求计算，关闭或移出迭代时同步更新。所有修改真实保存，完善加载、空态和错误反馈，提供覆盖提交、评审、排期、开发与验收的虚构示例。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "招聘管理",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建招聘管理工作台，以多维表格管理数据，串联职位需求、候选人跟进、面试反馈和录用入职。\n\n主要页面和功能：\n\n* 招聘概览：展示在招职位、待处理候选人、近期面试和录用进展，按部门、职位及负责人筛选，查看渠道转化与招聘周期。\n* 职位管理：维护岗位职责、任职要求、编制、工作地点和招聘负责人，支持开启、暂停和关闭，详情聚合候选人与招聘进度。\n* 候选人库：录入简历、联系方式、来源和意向职位，搜索筛选并提示重复记录；候选人与具体职位的申请分别管理，保留跟进时间线。\n* 招聘流程：用看板跟踪筛选、初试、复试、Offer、入职和结束状态，移动阶段时记录结论与下一步，拒绝或退出需注明原因。\n* 面试与反馈：维护面试时间、方式和面试官，查看待办，按岗位能力项填写评价与结论；安排冲突时提示调整。\n* Offer 与入职：记录录用审批、发出及确认状态、预计入职日期和实际到岗情况，提醒待确认与逾期事项。\n\n采用左侧导航、顶部职位筛选与新增入口；主区提供候选人列表和招聘看板，详情以简历、申请进展、面试评价分栏展示，安排面试使用抽屉。使用暖灰背景、白色卡片和低饱和青色，阶段标签清晰、表格紧凑，适配手机查看面试安排和提交反馈。\n\nHR 管理授权职位，面试官仅查看分配的候选人与面试资料，薪酬等字段限制访问。录用与淘汰由人员确认，统计基于职位申请记录并说明口径；所有修改持久保存，完善加载、空态、错误及操作反馈。提供完全虚构的简历和面试数据，演示从投递到入职的流程。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "生产监控",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建生产监控工作台，以多维表格管理数据，串联生产计划、班次报工、设备状态和异常处置。\n\n主要页面和功能：\n\n* 生产看板：按车间、产线、班次和日期查看计划产量、实际产量、达成率及良品率，展示工单进度、设备状态和未处理异常。\n* 生产工单：维护产品、计划数量、工序、起止时间与负责人，支持下发、开工、暂停和完工，详情聚合报工与异常记录。\n* 班次报工：录入工单、班次、合格数、不良数、工时和备注，支持提交、审核及退回修正，查看本人历史记录。\n* 设备台账：维护设备所属产线、运行状态和保养计划，记录开停机时间、停机原因及维修历程。\n* 异常中心：登记质量、缺料或设备异常，上传附件、指派负责人，跟踪处理中、待复核和已关闭状态，保留措施与复核结果。\n\n采用顶部车间与班次筛选、左侧业务导航；主区上方排列关键指标，中部突出产线和工单，下方展示异常队列。以深蓝灰看板、清晰数字和有限的状态色表达运行、停机与预警，提供浅色操作页面；手机端突出报工、拍照登记和处理反馈。\n\n数据来自人工报工及设备状态记录，展示最后更新时间，不模拟真实设备接入。仅审核通过的报工计入产量，修正记录保留历史，良品率以合格数除以总产量，稼动率基于已记录的运行时长与计划时长；缺少数据时显示待补充。操作员报工，班组长审核，维修人员处理分配异常。数据真实保存，完善空态、加载与错误提示，提供工单下发、报工、停机报修到复核完工的虚构示例。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "活动报名",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建活动报名工作台，以多维表格管理数据，串联活动发布、参与者报名、名额管理和现场签到。\n\n主要页面和功能：\n\n* 活动首页：以封面卡片展示活动时间、地点及报名状态，支持按类别和日期筛选；详情呈现介绍、日程、参与须知和报名入口。\n* 活动管理：维护封面、时间、地点、人数上限、截止时间和报名字段，支持草稿、发布及取消，预览参与者页面。\n* 报名表单：校验必填项与联系方式，提交后显示报名结果；参与者可查看本人报名信息及取消报名。\n* 名单管理：按活动、报名状态和签到状态筛选，查看详情、备注及导出名单；满额后进入候补，空出名额时由主办方确认递补。\n* 现场签到：按姓名或报名编号查找并签到，显示签到时间和经办人，重复签到给出提示，误操作可撤销并留痕。\n* 数据概览：统计有效报名、剩余名额、候补人数、签到率及报名趋势，支持切换活动与时间范围。\n\n参与者页面采用顶部导航、醒目封面与清晰报名按钮，手机端固定主要操作；管理端采用左侧导航、指标栏和名单表格，详情使用抽屉。使用暖白背景、珊瑚橙强调色和舒展留白，活动图片突出，状态与截止提示易辨识。\n\n发布前校验活动时间及报名截止时间，同一活动防止重复报名和超额占位，取消报名后同步更新名额。主办方管理本人活动，现场人员仅处理授权活动签到，参与者仅查看本人报名。数据持久保存，完善加载、空态及失败重试，提供覆盖发布、报名、候补、取消和签到的虚构示例。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "个人待办",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建个人待办工具，以多维表格管理数据，串联随手记录、任务整理、项目推进和完成回顾。\n\n主要页面和功能：\n\n* 今日：聚合今日到期、已逾期和主动安排到今天的任务，突出重要事项，支持快速新增、完成和调整日期。\n* 收集箱：随手记录任务与想法，稍后补充项目、优先级、截止时间和标签，支持批量归类。\n* 全部任务：按项目、状态、优先级和标签搜索筛选，支持排序、批量完成及重新打开；任务详情维护备注、子任务和提醒时间。\n* 项目：维护项目目标和计划日期，分组展示相关任务及完成比例，支持归档和恢复；归档时提示仍未完成的任务。\n* 计划与回顾：按周查看到期安排，回顾完成记录、逾期情况和项目进展，支持记录简短总结与下一周重点。\n\n采用左侧今日、收集箱、项目导航，中间为轻量任务列表，右侧抽屉编辑详情；顶部保留搜索和快速添加，复选框与日期操作清晰易用。使用米白背景、柔和绿色强调色和细分隔线，减少装饰，让任务标题成为视觉中心；手机端使用底部导航和便捷新增入口。\n\n任务完成时记录时间，重新打开后同步更新统计；子任务、项目进度和今日视图保持一致。延期和删除等操作提供反馈，删除支持撤销，个人数据仅本人可访问。所有修改持久保存，完善加载、空态和错误提示，提供工作与生活的虚构任务，演示从收集、归类、安排到完成回顾的流程。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
  },
  {
    "name": "阅读记录",
    "prompt": "帮我基于飞书多维表格数据库 /lark-base-database 搭建个人阅读记录工具，以多维表格管理数据，串联书单、阅读进度、摘抄笔记和阅读回顾。\n\n主要页面和功能：\n\n* 我的书架：以封面展示想读、在读、已读书籍，按作者、分类、标签和状态筛选，支持搜索及新增书籍。\n* 书籍详情：维护书名、作者、封面、总页数和阅读目标，更新当前页码，查看进度、阅读历程和关联笔记；读完后填写评分与短评。\n* 阅读记录：按日期记录起止页码、阅读时长和心得，支持补录与修正，汇总每本书的实际阅读投入。\n* 笔记：按书籍和章节保存摘抄、个人想法及页码，支持标签、全文搜索和编辑，从笔记返回对应书籍。\n* 阅读回顾：展示本月读完数量、阅读页数、投入时长和分类分布，查看阅读日历，记录阶段总结与下一本计划。\n\n采用顶部书架、笔记、回顾导航和全局搜索，主区以封面网格呈现书籍；详情左侧放封面与进度，右侧排列阅读记录和笔记，快速记录使用抽屉。使用纸张感米白背景、深棕正文和低饱和陶土色，书名采用衬线字体、数据使用清晰数字，保持舒展留白，适配手机单手记录。\n\n当前页码限定在总页数范围内，缺少总页数时不显示百分比；读完记录完成日期，重读建立独立阅读轮次，保留原有笔记和历史。修正记录后重新汇总统计，同一天多次阅读分别保存。数据持久存入多维表格且仅本人可访问，完善加载、空态及错误反馈，提供虚构书籍和原创示例笔记，演示从加入书架、更新进度、记录心得到完成回顾的流程。\n\n在开始之前，若未安装多维表格数据库 CLI 和 Skill，请先完成安装：\n\n安装 Lark CLI（已安装则跳过）\nnpx @larksuite/cli@latest install\n\n安装 Lark Base Database Skill（已安装则跳过）\nnpx @lark-base-open/base-site-cli@latest skill install --target all --force"
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
  // 新版 Hero：安装器（提示词折叠 + 复制提示词）。
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // 终端提示词展开 / 收起
  const heading = hero.querySelector('.code-heading');
  const toggleIcon = hero.querySelector('.code-toggle-icon .icon');
  if (heading) {
    heading.addEventListener('click', () => {
      const expanded = hero.classList.toggle('is-expanded');
      heading.setAttribute('aria-expanded', String(expanded));
      if (toggleIcon) toggleIcon.style.transform = expanded ? '' : 'rotate(180deg)';
    });
  }

  // 「复制提示词」：纯 text/plain，复制 #install-code-pre 的原文
  const copyBtn = hero.querySelector('.copy-install');
  const pre = document.getElementById('install-code-pre');
  if (copyBtn && pre) {
    const original = copyBtn.innerHTML;
    let timer = 0;
    copyBtn.addEventListener('click', async () => {
      if (copyBtn.dataset.copied === 'true') return;
      const text = INSTALL_PROMPT;
      const ok = await writeClipboard(text);
      if (!ok) return;
      copyBtn.dataset.copied = 'true';
      copyBtn.textContent = '已复制';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copyBtn.dataset.copied = 'false';
        copyBtn.innerHTML = original;
      }, 1600);
    });
  }
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

const INSTALL_PROMPT_BODY = `请帮我在本地执行以下命令
安装 Lark CLI（已安装则跳过）
npx @larksuite/cli@latest install

安装 Lark Base Database Skill
（同时安装到豆包工作和更多通用 Agent，如 Trae、Codex、Claude Code）
npx @lark-base-open/base-site-cli@latest skill install --target all --force`;
const INSTALL_PROMPT = INSTALL_PROMPT_BODY;

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

    const isFooter = cta.id === 'footer-cta';
    cta.addEventListener('click', async () => {
      if (cta.classList.contains('is-busy')) return;

      // 页尾 CTA：只复制安装提示词（含结尾引导句），不跳转
      await writeClipboard(isFooter ? INSTALL_PROMPT : DOUBAO_PROMPT);

      cta.classList.add('is-busy');
      if (arrow && !isFooter) arrow.src = CHECK_SRC;
      label.textContent = '';
      label.append(isFooter ? '已复制' : '提示词已复制，正在跳转');
      if (!isFooter) {
        const dots = document.createElement('span');
        dots.className = 'cta-dots';
        for (let i = 0; i < 3; i += 1) {
          const dot = document.createElement('i');
          dot.textContent = '.';
          dots.appendChild(dot);
        }
        label.appendChild(dots);
      }

      setTimeout(() => {
        if (!isFooter) window.open(DOUBAO_URL, '_blank', 'noopener');
        cta.classList.remove('is-busy');
        if (arrow) arrow.src = ARROW_SRC;
        label.textContent = original;
      }, isFooter ? 1600 : 2000);
    });
  };

  // Hero CTA 现在是参考页的「内测报名」外链（<a href>），保持原生跳转，不做复制/劫持；
  // 只有页尾的主 CTA 仍保留复制提示词 + 跳转豆包工作的交互。
  ['footer-cta']
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .forEach(bindCta);

  // UseCase 卡片：参考站点的「一句话预览 + 复制」按钮，复制完整提示词
  for (const btn of document.querySelectorAll('.case-prompt-copy')) {
    let timer;
    btn.addEventListener('click', async () => {
      if (btn.dataset.copied === 'true') return;
      const ok = await writeClipboard(CASE_PROMPTS[btn.dataset.case]);
      if (!ok) return;
      const original = btn.textContent;
      btn.dataset.copied = 'true';
      btn.textContent = '已复制';
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.dataset.copied = 'false';
        btn.textContent = original;
      }, 1600);
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
