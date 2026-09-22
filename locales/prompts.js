const commands = {
  cli: 'npx @larksuite/cli@latest install',
  skill: 'npx @lark-base-open/base-database-cli@latest skill install --target all --force',
};
export const installation = {
  en: `Please run the following commands locally.
Install Lark CLI (skip if already installed)
${commands.cli}

Install Lark Base Database Skill
(for Doubao Work and other general-purpose Agents, including Trae, Codex and Claude Code)
${commands.skill}`,
  ja: `以下のコマンドをローカルで実行してください。
Lark CLI をインストール（インストール済みの場合はスキップ）
${commands.cli}

Lark Base Database Skill をインストール
（Doubao Work と、Trae、Codex、Claude Code などの汎用 Agent にインストール）
${commands.skill}`,
};
const suffix = {
  en: `Before starting, install the Base Database CLI and Skill if they are not already installed.

Install Lark CLI (skip if already installed)
${commands.cli}

Install Lark Base Database Skill (skip if already installed)
${commands.skill}`,
  ja: `開始前に、多次元データベースの CLI と Skill が未インストールの場合は、以下を実行してください。

Lark CLI をインストール（インストール済みの場合はスキップ）
${commands.cli}

Lark Base Database Skill をインストール（インストール済みの場合はスキップ）
${commands.skill}`,
};
const en = [
  `Build a multi-store AI shift scheduling system using Feishu Base Database /lark-base-database. Store data in Base and connect scheduling, approvals and employee feedback.

Main pages and features:
* Schedule calendar: monthly and weekly views; filter by store and employee; inspect shifts, hours, costs and staffing shortages.
* AI scheduling: describe headcount and skills in natural language. Generate a draft using opening hours, availability, leave and working-hour limits. Allow manual edits, conflict checks and confirmed publication.
* Employees: maintain store, skills, employment type, hourly rate and availability; add, edit and deactivate staff.
* Stores: maintain opening hours, holidays and scheduling templates.
* Approvals: handle personnel changes and leave requests, with reasons and progress.
* My shifts: view shifts, accept or decline attendance, request leave and volunteer for open shifts.

Place branding, navigation and account controls at the top. Show hours, costs and staffing gaps above a large calendar, with filters and scheduling actions in its toolbar. Use a side drawer for shift details and a step-by-step AI flow for requirements, draft and publication. Use a sky gradient, rounded cards and clear spacing, with colored shift states, light/dark themes and mobile layouts.

Headquarters manages all stores, managers handle their own store and employees their own information. Require human confirmation before publishing AI drafts; keep shortages visible. Persist changes, notify employees after publication and sync feedback and cover shifts back to the calendar. Include fictional data demonstrating the complete workflow.`,
  `Build a smart home marketing workspace using Feishu Base Database /lark-base-database, connecting product entry, AI creation, asset editing, version history and downloads.

Manage products and their SKU variants, selling points, channels and original images. Let users select products and provide reference images through natural language to create hero, lifestyle and detail images plus promotional copy. Support edits to one item or a whole set while preserving product accuracy and brand consistency.

Pages and layout:
* Home: top navigation, a prominent creation input and quick tasks, followed by image cards for recent work and featured assets.
* Products: search and filters above cards showing product images, names and SKU counts. Details have image previews on the left, editable information on the right and SKU management below.
* AI chat: history on the left, messages, progress and result cards in the center, and an input at the bottom for selecting products and adding references. Ask for missing information.
* Asset library: filter by product, channel and type above an image grid. Group details by use, with multi-select editing, enlarged previews, version switching, restoration and batch downloads.
* Settings: grouped controls for brand colors, tone of voice, audience, dimensions and style requirements.

Use a light background, brand accents, rounded cards and generous spacing. Emphasize imagery and primary actions, support mobile layouts, and provide loading, empty and error states.

Persist data in Base and keep chat and page state synchronized. Preserve history and partial successes; flag assets that need updating when product information changes. Include sample data.`,
  `Build a sales CRM workspace using Feishu Base Database /lark-base-database. Store data in Base and connect customer follow-ups, deal configuration, quotations and closed orders.

Main pages and features:
* Sales dashboard: metric cards, a funnel and trends for deals, quotations, wins and conversion rates. Filter by time and owner and highlight at-risk deals and tasks.
* Customers: maintain accounts, contacts and owners. Aggregate related deals, quotations and orders in details, with a timeline of follow-ups.
* Deal configuration: manage stages, expected closing dates and next steps. Select items from products, packages or common bundles; adjust quantities and discounts; calculate prices and generate quotations.
* Products: category search, specifications, prices, active status and bundles.
* Quotations and orders: approval for large amounts, printing, sharing and view history. Convert confirmed quotations into orders and preserve the products and prices at the time of sale.
* Automated tasks: reminders for quotation expiry, expected closing and customer confirmation, with assignment, filters and completion.
* AI assistant: a chat sidebar for business queries; update follow-up plans or create tasks after confirmation.

Use grouped left navigation, top search and actions, split list/detail views, editing drawers and full-page quotation previews. Use warm gray backgrounds, white cards, thin borders and muted accents. Emphasize amounts, color-code states and keep tables compact and readable. Support light/dark themes and narrow screens, with loading, empty, error and action feedback. Link related pages, persist data and include sample data for a complete sales workflow.`,
  `Build a personal productivity workspace using Feishu Base Database /lark-base-database. Store data in Base and connect task capture, daily planning, focused work and reflection.

Main pages and features:
* Today: date, a personalized greeting and today's most important task, with a one-click 25-minute focus session. Quickly capture ideas or tasks and organize them as focus, important, regular or review items.
* Tasks: manage tasks and goals, priorities, deadlines and status. Search, filter, edit, complete and reopen tasks; set a daily focus, link goals and track progress.
* Focus: start, pause and end sessions for a chosen task, recording actual focused time and completion. Finish the task or continue another session; link history to the original task.
* Review: daily and weekly completed tasks, focus time and goal progress; record reflections and the next day's priorities.
* Overview: today's completion count and ratio, focus minutes and session count, ongoing goals and accomplishment scores entered in reviews.

Use centered pill navigation with branding, Today, Tasks, Review, search and account controls. Begin with the date and a large greeting. Put the daily focus and start button on the left and quick capture with category options on the right, followed by four overview cards. Edit tasks in side drawers and emphasize the timer and current task during focus. Use a soft lavender-to-light-blue gradient, white rounded cards, purple buttons and generous spacing. Use expressive serif typography for greetings and focus titles, with readable navigation, text and numbers. Keep the tone gentle and action-oriented and support mobile layouts.

Persist tasks, goals, sessions and reviews in Base. Keep totals consistent when tasks are completed or reopened and avoid duplicate sessions; paused time must not count as focus time. Preserve task state and active focus sessions after refresh. Support viewing and editing past reviews and accomplishment scores. Keep personal data private, provide loading, empty, error and action feedback, and include fictional tasks, goals and history demonstrating the full daily workflow.`,
  `Build a lightweight ERP workspace using Feishu Base Database /lark-base-database. Store data in Base and connect products, purchasing, inventory and sales.

Main pages and features:
* Overview: sales, purchase value, inventory value and gross margin trends, filtered by time and warehouse, highlighting low stock and pending documents.
* Products and partners: product codes, specifications, units and reference purchase/sale prices; manage suppliers and customers, with linked stock and transaction history.
* Purchases and sales: create documents, select products, edit quantities and discounts, calculate totals, and support draft, confirmation, partial receipt/shipment and completion. Preserve confirmed prices.
* Inventory: warehouse-level stock, reserved and available quantities and movement history; partial receipt/shipment, transfers and stocktakes, with reasons and operators.
* Documents: filter by type, state and owner; inspect links, history and print previews. Correct executed documents through returns or reversals.

Use left business navigation, top search and create actions, compact tables, line-item editors with fixed totals and detail drawers. Use warm white, thin borders, muted blue-green accents, right-aligned amounts and colored states. On mobile emphasize document lookup and receiving/shipping.

Record order confirmation separately from physical movements; only executed movements affect stock and repeated submissions must not double-count. Block shipments with insufficient stock. Calculate margins from actual cost and flag missing costs. Give administrators, buyers, sales and warehouse staff appropriate responsibilities. Persist and synchronize changes, provide loading/empty/error states, and include fictional data spanning purchase receipt to sales shipment.`,
  `Build a product feedback workspace using Feishu Base Database /lark-base-database. Store data in Base and connect feedback collection, review, iteration planning and release acceptance.

Main pages and features:
* Overview: feedback items by state and priority, iteration progress, upcoming deadlines and blocked items.
* Intake: capture title, problem, expected outcome, submitter, source and attachments. Search and filter submissions and track progress.
* Feedback inbox: list and board views by product, owner, priority and status; details include discussion, related feedback items and change history.
* Review: evaluate value, scope, effort and dependencies; record decisions and reasons, return incomplete submissions and link duplicates.
* Iterations: plan accepted feedback items, assign owners, dates and capacity, show dependencies and risks, and track execution.
* Acceptance: record release information, verification results and submitter feedback; failed acceptance returns to work with history preserved.

Use left navigation, top search and create actions, overview cards, a list/board switch and side drawers for details. Use a clean light background, restrained blue accents, compact rows and distinct state labels. Adapt to mobile review and status tracking.

Keep transitions traceable and consistent between feedback items and iterations. Require a review decision before scheduling and acceptance before closing; flag unassigned or overdue items. Submitters manage their submissions, reviewers make decisions and owners update progress. Persist data, protect role-based access, provide loading/empty/error feedback and fictional data from intake to acceptance.`,
  `Build a recruiting workspace using Feishu Base Database /lark-base-database. Store data in Base and connect job requisitions, candidate follow-up, interview feedback and hiring/onboarding.

Main pages and features:
* Overview: open roles, candidate pipeline, interview plans, hiring progress and overdue follow-ups, filtered by team, role and recruiter.
* Roles: headcount, requirements, department, hiring manager, priority and status; inspect related candidates and progress.
* Candidates: searchable profiles, source, resume attachments, contact information and applications, with stage, owner and follow-up history.
* Interviews: schedule rounds, participants and evaluation criteria, record feedback and outcomes, and flag timing conflicts.
* Offers and onboarding: approval status, offer results, expected start dates and onboarding tasks; preserve withdrawal and rejection reasons.
* Tasks: assigned follow-ups, interview feedback and onboarding reminders with deadlines and completion.

Use left navigation, top search and actions, a pipeline board with a table alternative, profile drawers with timelines and a clear interview calendar. Use a light background, muted violet accents, readable cards and status colors. Support narrow screens.

Track each application separately so one candidate may apply to multiple roles. Require reasons for key stage changes, avoid duplicate profiles and restrict resumes, contact details and evaluations to authorized users. Interviewers see only assigned interviews; recruiters and managers follow role permissions. Persist data with loading/empty/error states and fictional profiles demonstrating the complete recruiting process.`,
  `Build a production monitoring workspace using Feishu Base Database /lark-base-database. Store data in Base and connect production plans, shift reports, equipment state and exception handling.

Main pages and features:
* Overview: planned versus actual output, completion rate, quality, downtime and open exceptions, filtered by workshop, line, shift and date.
* Work orders: products, target quantities, dates, lines and owners; track released, running, paused and completed orders with linked reports.
* Shift reporting: record good and defective quantities, working time, operators and notes; support corrections with reasons.
* Equipment: status, assigned line, maintenance records and downtime; report faults and track handling.
* Exceptions: classify quality, equipment and material issues, assign owners, follow progress and verify resolution.
* Reports: trends by shift, line and product, with drill-down to original records.

Use left navigation, filters and metric cards above a compact production table and line-status cards; use drawers for reporting and exception details. Use a neutral background with restrained industrial blue, readable numbers and semantic status colors. Support workshop tablets and mobile reporting.

Calculate totals only from valid reports; prevent duplicate reporting and flag excess quantities. Distinguish manual records from device data without simulating live device connections. Preserve correction history and require verification before closing exceptions and completing orders. Apply planner, operator and supervisor permissions. Persist data, show loading/empty/error states and include fictional work orders from release to reporting, fault handling and verified completion.`,
  `Build an event registration workspace using Feishu Base Database /lark-base-database. Store data in Base and connect publishing, registration, capacity management and check-in.

Main pages and features:
* Events: cover cards with dates, locations and registration status; filter by category/date; details show the introduction, agenda, participation notes and registration action.
* Management: edit cover, dates, location, capacity, deadline and registration fields; draft, publish, cancel and preview the attendee page.
* Registration: validate required fields and contact information; show results and let attendees view or cancel their registration.
* Attendees: filter by event, registration and check-in status; inspect details and notes and export lists. Waitlist when full; organizers confirm promotions when spaces open.
* Check-in: search by name or registration number, record time/operator, flag repeat check-ins and allow audited corrections.
* Analytics: valid registrations, remaining capacity, waitlist, attendance rate and trends by event/time.

Use top navigation, prominent covers and clear registration actions for attendees, with a fixed mobile action. Use left navigation, metrics, tables and detail drawers for organizers. Use warm white, coral accents, generous spacing and clear deadlines and states.

Validate event and cutoff times before publishing. Prevent duplicate registrations and overbooking and update capacity after cancellations. Organizers manage their events, staff check in authorized events and attendees access only their own registrations. Persist data with loading/empty/error and retry states. Include fictional examples covering publication, registration, waiting, cancellation and check-in.`,
  `Build a personal task tool using Feishu Base Database /lark-base-database. Store data in Base and connect quick capture, organization, project work and completion reviews.

Main pages and features:
* Today: today's due, overdue and explicitly scheduled tasks; highlight priorities and allow quick creation, completion and date changes.
* Inbox: capture tasks and ideas, add projects, priorities, deadlines and tags later, and organize in batches.
* All tasks: search/filter by project, state, priority and tag; sort, batch-complete and reopen. Details include notes, subtasks and reminder times.
* Projects: objectives and planned dates, grouped tasks and completion percentages; archive/restore with a warning for unfinished tasks.
* Planning and review: weekly due dates, completed work, overdue items and project progress; short reflections and next-week priorities.

Use left navigation for Today, Inbox and Projects, a light central task list and a right-hand detail drawer. Keep search and quick-add above, with clear checkboxes and date actions. Use off-white, soft green accents and fine dividers, prioritizing task titles. Use bottom navigation and easy task creation on mobile.

Record completion time and update statistics when reopening. Keep subtasks, project progress and Today consistent. Give feedback for postponing/deleting and support undo for deletion. Personal data is private. Persist all changes with loading/empty/error states and fictional work and personal tasks demonstrating capture through review.`,
  `Build a personal reading log using Feishu Base Database /lark-base-database. Store data in Base and connect books, progress, highlights, notes and reading reviews.

Main pages and features:
* Bookshelf: covers grouped as want to read, reading and finished; search/filter by author, category, tag and state, and add books.
* Book details: title, author, cover, total pages and reading goal; update the current page and inspect progress, history and linked notes. Rate and review finished books.
* Sessions: date, start/end pages, duration and thoughts, with backdated entry and corrections; total actual effort by book.
* Notes: highlights and personal thoughts by book/chapter, with page numbers, tags, full-text search, editing and links back to books.
* Review: monthly finished books, pages, time and category distribution, a reading calendar, reflections and next-book plans.

Use top navigation for Bookshelf, Notes and Review with global search and a cover grid. Place cover/progress on the left of details, sessions and notes on the right, and quick entry in drawers. Use paper-like off-white, dark brown text, muted terracotta, serif book titles and readable numbers. Keep generous spacing and support one-handed mobile entry.

Limit current page to total pages; omit percentages if totals are unknown. Record finish dates and create a new reading round for rereads, preserving notes and history. Recalculate totals after corrections and allow multiple sessions per day. Persist private data in Base with loading/empty/error states and fictional books and original notes demonstrating the full reading workflow.`,
];
const ja = [
  `Feishu Base Database /lark-base-database を使い、複数店舗向けの AI シフト管理システムを構築してください。データは Base に保存し、シフト作成、承認、従業員の回答を連携させます。

主な画面と機能：
* シフトカレンダー：月・週表示、店舗・従業員の絞り込み、シフト詳細、労働時間、コスト、人員不足の確認。
* AI シフト作成：必要人数とスキルを自然言語で指定。営業時間、勤務可能時間、休暇、労働時間の制限を考慮して下書きを生成し、手動調整、競合チェック、確認後の公開に対応。
* 従業員管理：所属店舗、スキル、雇用形態、時給、勤務可能時間を管理し、追加・編集・無効化。
* 店舗管理：営業時間、祝休日、シフトテンプレートを管理。
* 承認：人員変更や休暇申請の理由と進捗を確認して処理。
* 自分のシフト：確認、出勤の承諾・辞退、休暇申請、欠員シフトへの応募。

上部にブランド、ナビゲーション、アカウントを配置。労働時間、コスト、欠員の指標カードの下に大きなカレンダーを置き、絞り込みと作成ボタンをツールバーに配置します。詳細はサイドドロワー、AI 作成は条件入力・下書き・公開の段階式にします。空色のグラデーション、角丸カード、余白、状態別の色を使い、明暗テーマとスマートフォンに対応してください。

本部は全体、店長は自店舗、従業員は本人の情報を操作。AI 下書きは人が確認して公開し、欠員は警告を残します。変更を保存し、公開後に従業員へ通知、回答や補充をカレンダーに同期。架空データで全工程を実演できるようにしてください。`,
  `Feishu Base Database /lark-base-database を使い、商品登録、AI 制作、素材修正、版管理、ダウンロードをつなぐスマートホーム向けマーケティングワークスペースを構築してください。

商品と SKU、訴求点、チャネル、元画像を管理。自然言語で商品を選び、参考画像を提供して、メイン画像、使用シーン、詳細画像、販促文を生成します。単体・セット単位で修正でき、商品の正確性とブランドの統一感を維持してください。

画面と構成：
* ホーム：上部ナビゲーション、目立つ制作入力欄とクイックタスク、その下に最近の作業とおすすめ素材の画像カード。
* 商品管理：検索・絞り込み、商品画像・名称・SKU 数のカード。詳細は左に画像、右に編集欄、下に SKU 管理。
* AI チャット：左に履歴、中央にメッセージ・進捗・結果カード、下部に商品選択と参考画像添付ができる入力欄。不足情報は追加を案内。
* 素材ライブラリ：商品・チャネル・種類で絞り込むグリッド。用途別詳細、複数選択修正、拡大、履歴切り替え、復元、一括ダウンロード。
* 設定：ブランド色、文体、対象顧客、画像サイズ、スタイル要件を区分して管理。

明るい背景、ブランドの強調色、角丸カードと余白で、画像と主要操作を際立たせます。モバイル、読み込み中、空状態、エラー表示に対応してください。

データは Base に保存し、チャットと画面の状態を同期。履歴と一部成功した結果を保持し、商品情報変更時には素材更新を案内。サンプルデータを用意してください。`,
  `Feishu Base Database /lark-base-database を使い、顧客フォロー、商談構成、見積もり、契約・受注をつなぐ営業 CRM を構築してください。データは Base に保存します。

主な画面と機能：
* 営業ダッシュボード：商談、見積もり、受注、転換率を指標カード、ファネル、推移グラフで表示。期間・担当者で絞り込み、リスク商談とタスクを強調。
* 顧客管理：顧客、連絡先、担当者を管理。詳細に関連商談、見積もり、注文と対応履歴を集約。
* 商談構成：段階、受注予定日、次のアクションを管理。商品、パッケージ、定番セットを選び、数量・割引を調整して自動計算し、見積もりを生成。
* 商品管理：分類検索、仕様、価格、有効状態、セット構成。
* 見積もりと注文：高額承認、印刷、共有、閲覧履歴。顧客確認後に正式注文へ変換し、受注時の商品と価格を保持。
* 自動タスク：見積期限、受注予定、顧客確認に応じたリマインダー、担当割当、絞り込み、完了。
* AI アシスタント：サイドバーで業務照会。確認後にフォロー計画更新やタスク作成。

左に分類ナビゲーション、上に検索・操作、一覧と詳細の分割表示、編集用ドロワー、全画面の見積プレビューを配置。暖かいグレー背景、白いカード、細い境界線、落ち着いた強調色を使い、金額と状態を明確にし、表は読みやすくコンパクトにします。明暗テーマ、狭い画面、読み込み・空状態・エラー・操作結果を整え、関連画面の移動、永続保存、営業工程を通せるサンプルデータを用意してください。`,
  `Feishu Base Database /lark-base-database を使い、タスク収集、日々の計画、集中作業、振り返りをつなぐ個人の生産性ワークスペースを構築してください。データは Base に保存します。

主な画面と機能：
* 今日：日付、挨拶、最重要タスクと 25 分の集中開始。アイデアやタスクを素早く記録し、集中・重要・通常・振り返りに分類。
* タスク：目標、優先度、期限、状態、検索、絞り込み、編集、完了、再開。今日の焦点に設定し、目標と関連付けて進捗を確認。
* 集中：選択タスクの開始・一時停止・終了、実際の集中時間と完了状況を記録。終了後は完了または次のセッションへ進み、履歴を元タスクに関連付ける。
* 振り返り：日・週ごとの完了タスク、集中時間、目標進捗、感想、翌日の重点。
* データ概況：今日の完了数・割合、集中時間・記録数、進行中の目標数、振り返りで記入した達成感スコアを自動集計。

上部に中央揃えのカプセル型ナビゲーションを置き、ブランド、今日、タスク、振り返り、検索、アカウントを含めます。日付と大きな挨拶の下に、左は今日の焦点と集中ボタン、右はクイック入力と分類、さらに下に 4 枚の概況カードを配置。編集はサイドドロワー、集中中はタイマーと対象タスクを強調。薄紫から薄青の柔らかなグラデーション、白い角丸カード、紫のボタン、ゆとりある余白を使用。挨拶と焦点の見出しは手書き感のあるセリフ体、本文と数値は読みやすくし、穏やかな文体とモバイル表示に対応。

タスク、目標、集中記録、振り返りを永続保存。完了・再開時の集計を同期し、集中記録の二重作成を防ぎ、一時停止時間は集中時間に含めません。再読み込み後もタスク状態と進行中の集中セッションを保持し、過去の振り返りや達成感スコアを閲覧・編集可能にします。個人データを保護し、読み込み・空状態・エラー・操作結果を整備。架空のタスク、目標、履歴で一日の流れを実演してください。`,
  `Feishu Base Database /lark-base-database を使い、商品、仕入、在庫、販売をつなぐ軽量 ERP を構築してください。データは Base に保存します。

主な画面と機能：
* 概況：売上、仕入額、在庫額、粗利推移、期間・倉庫の絞り込み、在庫不足と未処理伝票。
* 商品と取引先：商品コード、仕様、単位、仕入・販売参考価格、仕入先と顧客、関連在庫と取引履歴。
* 仕入・販売：伝票作成、商品選択、数量・割引、自動計算、下書き・確定・一部入出荷・完了。確定価格を保持。
* 在庫：倉庫別の現存・引当・利用可能数と入出庫履歴、分割入出庫、移動、棚卸、理由と担当者。
* 伝票：種類・状態・担当者で絞り込み、関連伝票、履歴、印刷。実行済み伝票は返品・取消仕訳で修正。

左に業務ナビゲーション、上部に検索と新規作成、中央に表、伝票編集に明細行と固定合計欄、詳細にドロワーを使用。暖かい白背景、細い線、低彩度の青緑、右揃えの金額と状態色を使い、モバイルは検索と入出荷を重視します。

注文確定と実際の入出庫を分け、実行済みの移動だけ在庫へ反映し、重複送信で二重計上しないこと。在庫不足の出庫を防ぎ、実原価で粗利を計算し、原価不足は明示。管理者・仕入・販売・倉庫の役割を分け、保存・同期、読み込み・空状態・エラーを整備。仕入から販売出荷までの架空データを用意してください。`,
  `Feishu Base Database /lark-base-database を使い、要望収集、審査、イテレーション計画、公開後の受入確認をつなぐチーム要望管理を構築してください。データは Base に保存します。

主な画面と機能：
* 概況：状態・優先度別件数、進捗、期限、停滞項目。
* 受付：件名、課題、期待する結果、申請者、出所、添付、検索と進捗確認。
* 要望一覧：製品・担当者・優先度・状態別の表とボード。詳細に議論、関連要望、変更履歴。
* 審査：価値、範囲、工数、依存関係、判断と理由、不足情報の差戻し、重複要望の関連付け。
* イテレーション：承認済み要望の計画、担当、日程、容量、依存関係とリスク、実行状況。
* 受入確認：公開情報、検証結果、申請者の評価。不合格なら履歴を残して対応へ戻す。

左ナビゲーション、上部検索と新規作成、概況カード、一覧・ボード切り替え、詳細ドロワーを配置。明るい背景、控えめな青、コンパクトな行、明確な状態ラベルで、モバイルの審査・進捗確認にも対応。

状態変更を追跡し、要望と計画を同期。審査前の計画投入と受入前の完了を防ぎ、担当未設定・期限超過を通知。申請者、審査者、担当者の権限を区別し、保存、読み込み・空状態・エラー、受付から受入までの架空データを用意してください。`,
  `Feishu Base Database /lark-base-database を使い、求人要件、候補者対応、面接評価、採用・入社をつなぐ採用管理を構築してください。データは Base に保存します。

主な画面と機能：
* 概況：募集中求人、候補者段階、面接予定、採用進捗、期限超過の対応。部署・求人・担当者で絞り込み。
* 求人：人数、要件、部署、責任者、優先度、状態、候補者と進捗。
* 候補者：プロフィール、流入元、履歴書、連絡先、応募、段階、担当者、対応履歴と検索。
* 面接：選考段階、日時、参加者、評価基準、フィードバック、結果、日程競合の通知。
* 内定・入社：承認状況、内定回答、入社予定、入社タスク、辞退・不採用理由。
* タスク：候補者対応、面接評価、入社準備の割当、期限、完了。

左ナビゲーション、上部検索・操作、選考ボードと表表示、履歴付きプロフィールドロワー、面接カレンダーを配置。明るい背景、低彩度の紫、読みやすいカードと状態色、狭い画面に対応。

候補者と応募を分け、複数求人への応募を保持。重要な段階変更に理由を要求し、プロフィール重複を防止。履歴書、連絡先、評価は権限者のみ閲覧でき、面接担当者は担当面接に限定。保存、読み込み・空状態・エラーを整備し、架空候補者で採用の全工程を実演してください。`,
  `Feishu Base Database /lark-base-database を使い、生産計画、シフト実績、設備状態、異常対応をつなぐ生産監視を構築してください。データは Base に保存します。

主な画面と機能：
* 概況：計画と実績、達成率、品質、停止時間、未解決異常。工場・ライン・シフト・日付で絞り込み。
* 製造指示：商品、目標数量、日程、ライン、責任者、発行・稼働・中断・完了、関連実績。
* 実績報告：良品・不良数量、作業時間、担当者、備考、理由付き修正。
* 設備：状態、所属ライン、保全履歴、停止、故障報告と対応状況。
* 異常：品質・設備・材料の分類、担当割当、進捗、解決確認。
* レポート：シフト・ライン・商品別推移と元記録への移動。

左ナビゲーション、絞り込み、指標カード、コンパクトな生産表、ライン状態カードを配置。報告・異常詳細はドロワー。中立背景、控えめな青、読みやすい数値と意味のある状態色を使い、現場のタブレットとスマートフォンに対応。

有効な報告のみ集計し、重複と過剰数量をチェック。手入力と装置データを区別し、未接続の装置をリアルタイム接続として見せないこと。修正履歴を残し、異常解決・製造完了は確認を必須にします。計画担当、作業者、監督者の権限を分け、保存、読み込み・空状態・エラー、発行から報告、故障対応、完了確認までの架空データを用意してください。`,
  `Feishu Base Database /lark-base-database を使い、公開、申込、定員管理、受付をつなぐイベント申込管理を構築してください。データは Base に保存します。

主な画面と機能：
* イベント一覧：画像、日時、場所、申込状態、分類・日付の絞り込み。詳細に紹介、日程、注意事項、申込。
* 管理：画像、開催時間、場所、定員、締切、申込項目、下書き・公開・中止、参加者画面のプレビュー。
* 申込：必須項目・連絡先チェック、結果表示、本人の申込確認・取消。
* 参加者：イベント・申込・受付状態で絞り込み、詳細、備考、出力。満員時はキャンセル待ち、空席時は主催者が繰り上げ確認。
* 受付：氏名・申込番号で検索し、日時と担当者を記録。重複受付を通知し、誤操作の取消は履歴を残す。
* 集計：有効申込、残席、待機人数、参加率、推移、イベント・期間切り替え。

参加者向けは上部ナビゲーション、目立つ画像と申込ボタン、モバイルの固定操作。管理画面は左ナビゲーション、指標、名簿表、詳細ドロワー。暖かい白、コーラルオレンジ、余白、明確な状態と締切表示を使います。

公開前に日時と締切を確認し、重複申込と定員超過を防止。取消時に残席を更新。主催者は自分のイベント、受付担当は許可されたイベント、参加者は本人の申込のみ操作。保存、読み込み・空状態・再試行を整備し、公開から申込、待機、取消、受付までの架空データを用意してください。`,
  `Feishu Base Database /lark-base-database を使い、メモ、整理、プロジェクト推進、完了後の振り返りをつなぐ個人タスク管理を構築してください。データは Base に保存します。

主な画面と機能：
* 今日：本日期限、期限超過、今日に割り当てたタスクを集約し、重要事項、新規追加、完了、日付変更。
* 受信箱：タスクやアイデアを素早く記録し、プロジェクト、優先度、期限、タグを後から補完。一括分類。
* 全タスク：プロジェクト・状態・優先度・タグで検索と絞り込み、並べ替え、一括完了、再開。詳細にメモ、サブタスク、通知日時。
* プロジェクト：目標、予定日、関連タスク、達成率、アーカイブと復元。未完了がある場合は案内。
* 計画と振り返り：週の期限、完了履歴、遅延、進捗、短い振り返りと翌週の重点。

左に今日・受信箱・プロジェクト、中央に軽い一覧、右に詳細ドロワー。上に検索と追加、分かりやすいチェック欄と日付操作。米白背景、柔らかな緑、細い区切り線でタスク名を主役に。モバイルは下部ナビゲーションと追加操作。

完了時刻を記録し、再開時に統計を更新。サブタスク、プロジェクト進捗、今日の表示を同期。延期・削除の結果を表示し、削除は取り消し可能にします。個人データは本人のみアクセスし、全変更を保存。読み込み・空状態・エラー、仕事と生活の架空タスクで収集から振り返りまでを実演してください。`,
  `Feishu Base Database /lark-base-database を使い、本棚、読書進捗、引用・メモ、振り返りをつなぐ個人読書記録を構築してください。データは Base に保存します。

主な画面と機能：
* 本棚：読みたい・読書中・読了を表紙で表示し、著者・分類・タグ・状態で検索と絞り込み、新規登録。
* 書籍詳細：書名、著者、表紙、総ページ、目標、現在ページ、進捗、読書履歴、関連メモ。読了後は評価と短評。
* 読書記録：日付、開始・終了ページ、時間、感想、後日入力と修正。書籍別の実際の読書時間を集計。
* メモ：書籍・章ごとの引用、考え、ページ、タグ、全文検索、編集、元の本へ戻るリンク。
* 振り返り：月の読了数、ページ数、時間、分類構成、読書カレンダー、感想と次の計画。

上部に本棚・メモ・振り返りと検索、中央に表紙グリッド。詳細は左に表紙と進捗、右に記録とメモ、素早い入力はドロワー。紙のような米白、濃い茶、低彩度のテラコッタ、セリフ体の書名と明瞭な数値、余白、片手で使えるモバイル表示。

現在ページは総ページ以内に制限し、総数不明なら割合を出さないこと。読了日を記録し、再読は別の読書回として過去のメモと履歴を保持。修正後に再集計し、同日複数回の記録を保存。本人のみアクセスできるようにし、読み込み・空状態・エラー、架空の書籍とオリジナルのメモで全工程を実演してください。`,
];
export const localizedPrompts = Object.fromEntries(
  Object.entries({ en, ja }).map(([language, prompts]) => [
    language,
    prompts.map((prompt) => `${prompt}\n\n${suffix[language]}`),
  ]),
);
