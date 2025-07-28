**PigeonPrompt: UI/UX Design Specification & Style Guide**

**1. Design Philosophy & Strategy**

**1.1. Brand Personality**

**Intelligent, Accessible, Efficient, Collaborative**

PigeonPrompt embodies the intersection of cutting-edge AI technology and
intuitive human-centered design. The platform radiates intelligence
through its sophisticated feature set while maintaining accessibility
for both seasoned developers and creative professionals. Efficiency is
paramount---every interaction is designed to accelerate the prompt
engineering workflow. Collaboration flows naturally through shared
workspaces and community-driven discovery.

**1.2. Core Design Principles**

**Clarity Over Clutter** Every interface element serves a clear purpose.
Information hierarchy is immediately recognizable, with primary actions
prominent and secondary options appropriately subdued. Complex workflows
are broken into digestible, logical steps.

**Efficiency Through Flow** User journeys are optimized for speed and
minimal cognitive load. Frequently used actions are within one click.
Context switching is minimized through intelligent layout design and
persistent state management.

**Confidence Through Consistency** Predictable patterns reduce learning
curves. Components behave identically across contexts. Visual language
remains unified throughout the platform, creating a sense of familiarity
and trust.

**Delight in the Details** Micro-interactions provide gentle feedback.
Animations are purposeful and respect user preferences. Error states are
helpful rather than punitive, guiding users toward successful outcomes.

**1.3. Microcopy & Messaging Guidelines**

**Tone:** Professional yet approachable, technical but not intimidating,
encouraging rather than demanding.

**Success Messages:**

- "Prompt saved successfully! Ready to share with your team?"

- "Files connected. Your context is now supercharged."

- "Great choice! This prompt has a 94% success rate in the community."

**Info Messages:**

- "Token count: 2,847/4,096. You're in the sweet spot for most
  models."

- "5 team members are currently active in this workspace."

- "This template uses advanced Chain-of-Thought reasoning."

**Warning Messages:**

- "Approaching token limit. Consider using file snippets instead of
  full files."

- "This model works best with structured prompts. Want to use a
  template?"

- "Large file detected. Preview first 500 lines?"

**Error Messages:**

- "Connection lost. Don't worry---your work is saved locally.
  Reconnecting..."

- "File access denied. Check your browser permissions and try again."

- "Prompt execution failed. The model might be experiencing high
  demand. Retry?"

**Empty States:**

- "Your prompt journey starts here. Connect a project folder to
  begin."

- "No execution history yet. Run your first prompt to see results
  appear here."

- "Discover community favorites while you craft your perfect prompt."

**Loading States:**

- "Analyzing your codebase..."

- "Executing across 3 models..."

- "Building your context..."

**2. Design System Foundations (The Atoms)**

**2.1. Color System**

**Primary Brand Palette**

The core brand identity centers around a sophisticated gradient that
conveys both technological innovation and natural growth.

- **Primary Green:** #377674 - The cornerstone of our brand identity.
  Used for primary CTAs, active states, navigation highlights, and
  success indicators. This deep teal suggests both technological
  precision and organic intelligence.

- **Secondary Gray:** #A0AEC0 - A sophisticated neutral that pairs
  perfectly with Primary Green. Used in gradients, secondary text, and
  subtle UI elements.

- **Accent Green:** #569f89 - A brighter, more energetic variant used
  for hover states, secondary highlights, and interactive feedback.

- **Brand Gradient:** linear-gradient(135deg, #377674 0%, #A0AEC0
  100%) - The signature gradient applied to primary buttons, header
  elements, and key brand moments.

**Semantic & System Palette**

Derived from the CSS custom properties for consistent theming across
light and dark modes.

- **Success/Primary:** hsl(178.1, 36.4%, 33.9%) (#377674)

- **Warning:** hsl(37.7, 92.1%, 50.2%) (#f59e0b) - Warm amber for
  caution states

- **Error/Destructive:** hsl(0, 76.3%, 57.1%) (#ef4444) - Clear red for
  errors and destructive actions

- **Focus Ring:** hsl(178.1, 36.4%, 33.9%) - Consistent teal focus
  indicator for accessibility

- **Info:** hsl(214.3, 100%, 57.1%) (#3b82f6) - Professional blue for
  informational states

**Neutral Palette**

A carefully curated range of grays that work harmoniously in both light
and dark themes.

**Light Mode:**

- **Background:** #eef2ef - Soft, slightly green-tinted background

- **Foreground:** hsl(220, 25.7%, 13.7%) - Rich dark gray for primary
  text

- **Card Background:** hsl(0, 0%, 100%) - Pure white for content areas

- **Muted Background:** hsl(210, 40%, 96%) - Light gray for secondary
  areas

- **Border:** hsl(216, 12.2%, 83.9%) - Subtle borders that don't
  compete with content

**Dark Mode:**

- **Background:** hsl(222.2, 84%, 4.9%) - Deep, rich dark background

- **Foreground:** hsl(210, 40%, 98%) - High-contrast light text

- **Card Background:** hsl(222.2, 84%, 4.9%) - Consistent with
  background for seamless cards

- **Muted Background:** hsl(217.2, 32.6%, 17.5%) - Elevated surface
  color

**Color Usage Rules**

- **Text Contrast:** All text/background combinations must meet WCAG 2.1
  AA standards (4.5:1 minimum ratio)

- **Interactive Elements:** Use Primary Green for clickable elements,
  Accent Green for hover states

- **Semantic Consistency:** Error states always use the destructive red;
  success states use Primary Green

- **Brand Gradient:** Reserved for primary CTAs, headers, and premium
  features

**2.2. Typography System**

**Font Families**

- **Primary (UI Text):** Inter, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, sans-serif

- **Monospace (Code/Prompts):** "Fira Code", "Monaco", "Cascadia
  Code", "Roboto Mono", monospace

**Type Scale**

A harmonious scale based on 1.200 ratio for optimal readability and
hierarchy.

**Desktop Scale:**

- **H1:** font-size: 48px; font-weight: 700; line-height: 1.2;
  letter-spacing: -0.02em;

- **H2:** font-size: 40px; font-weight: 600; line-height: 1.2;
  letter-spacing: -0.01em;

- **H3:** font-size: 32px; font-weight: 600; line-height: 1.3;
  letter-spacing: -0.01em;

- **H4:** font-size: 24px; font-weight: 600; line-height: 1.4;

- **H5:** font-size: 20px; font-weight: 500; line-height: 1.4;

- **H6:** font-size: 16px; font-weight: 500; line-height: 1.5;

- **Body Large:** font-size: 18px; font-weight: 400; line-height: 1.6;

- **Body:** font-size: 16px; font-weight: 400; line-height: 1.6;

- **Body Small:** font-size: 14px; font-weight: 400; line-height: 1.5;

- **Caption:** font-size: 12px; font-weight: 400; line-height: 1.4;

- **Code:** font-size: 14px; font-weight: 400; line-height: 1.6;
  font-family: var(--font-mono);

**Mobile Scale (Responsive Adjustments):**

- **H1:** font-size: 36px;

- **H2:** font-size: 30px;

- **H3:** font-size: 24px;

- **H4:** font-size: 20px;

**2.3. Spacing & Grid System**

**Base Unit**

**8px** - All spacing, padding, margins, and layout measurements are
multiples of this base unit for pixel-perfect consistency.

**Spacing Scale**

- **xs:** 4px (0.5 × base)

- **sm:** 8px (1 × base)

- **md:** 16px (2 × base)

- **lg:** 24px (3 × base)

- **xl:** 32px (4 × base)

- **2xl:** 48px (6 × base)

- **3xl:** 64px (8 × base)

- **4xl:** 96px (12 × base)

**Layout Grid & Breakpoints**

- **Mobile:** < 768px - Single column, 16px side margins

- **Tablet:** 768px - 1024px - 12 column grid, 24px gutters

- **Desktop:** > 1024px - 12 column grid, 32px gutters

- **Max Width:** 1440px - Content container maximum width

**2.4. Iconography**

**Style & Guidelines**

**Lucide Icons** - Consistent 2px stroke weight, minimalist line style

- **Sizes:** 16px (small), 20px (default), 24px (large), 32px (extra
  large)

- **Colors:** Match surrounding text color or use semantic colors for
  status

- **Spacing:** 8px minimum distance from adjacent text or elements

**Common Icon Usage**

- **Files:** Document, folder, code symbols

- **Actions:** Plus, edit, trash, download, share

- **Navigation:** Arrow variants, menu, close

- **Status:** Check circle, alert triangle, info circle, x circle

**2.5. Effects & Styles**

**Border Radius Scale**

Based on var(--radius) = 8px

- **Small:** 4px - Input fields, small buttons

- **Default:** 8px - Cards, buttons, most components

- **Large:** 12px - Modals, large cards

- **XLarge:** 16px - Hero sections, featured content

- **Full:** 9999px - Pills, avatars

**Shadow System**

Subtle elevations that enhance hierarchy without overwhelming the
interface.

- **sm:** box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

- **md:** box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px
  rgba(0, 0, 0, 0.06);

- **lg:** box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px
  -2px rgba(0, 0, 0, 0.05);

- **xl:** box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px
  -5px rgba(0, 0, 0, 0.04);

- **brand:** box-shadow: 0 8px 25px -8px rgba(55, 118, 116, 0.3); - For
  primary elements

**2.6. Motion & Animation**

**Easing Curves**

- **Standard:** cubic-bezier(0.4, 0.0, 0.2, 1) - General UI animations

- **Decelerate:** cubic-bezier(0.0, 0.0, 0.2, 1) - Elements entering the
  screen

- **Accelerate:** cubic-bezier(0.4, 0.0, 1, 1) - Elements leaving the
  screen

- **Sharp:** cubic-bezier(0.4, 0.0, 0.6, 1) - Attention-grabbing
  movements

**Duration Scale**

- **Fast:** 150ms - Micro-interactions, hover states

- **Normal:** 300ms - Standard transitions, modal open/close

- **Slow:** 500ms - Complex transitions, page changes

- **Emphasis:** 700ms - Loading states, success confirmations

**Animation Principles**

- **Purposeful:** Every animation serves a functional purpose

- **Respectful:** Honor prefers-reduced-motion accessibility settings

- **Consistent:** Use the same duration and easing for similar
  interactions

- **Subtle:** Enhance rather than distract from the user's primary task

**3. Component Library (The Molecules & Organisms)**

**3.1. Buttons**

**Primary Button**

**Use Case:** Main calls-to-action ("Create Prompt," "Save Changes,"
"Execute Prompt")

**Visual Anatomy:** Rounded rectangle with brand gradient background,
centered white text, subtle shadow elevation.

**States:**

- **Default:** background: linear-gradient(135deg, #377674 0%, #A0AEC0
  100%); color: white; padding: 12px 24px; border-radius: 8px;
  font-weight: 500; box-shadow: 0 2px 4px rgba(55, 118, 116, 0.2);

- **Hover:** Gradient brightens slightly, shadow
  intensifies: box-shadow: 0 4px 12px rgba(55, 118, 116, 0.3);
  transform: translateY(-1px);

- **Focus:** Visible 2px ring: box-shadow: 0 0 0 2px hsl(178.1, 36.4%,
  33.9%);

- **Active:** Slightly depressed appearance: transform: translateY(0px)
  scale(0.98);

- **Disabled:** Solid muted background: background: hsl(210, 40%, 96%);
  color: hsl(215.4, 16.3%, 46.9%); cursor: not-allowed;

- **Loading:** Text replaced by white spinner, button remains full width

**Secondary Button**

**Use Case:** Secondary actions ("Cancel," "View History," "Import
Template")

**States:**

- **Default:** background: transparent; border: 1px solid #377674;
  color: #377674; padding: 12px 24px;

- **Hover:** background: rgba(55, 118, 116, 0.1); border-color: #569f89;

- **Focus:** Same focus ring as primary button

- **Active:** background: rgba(55, 118, 116, 0.15);

- **Disabled:** border-color: hsl(215.4, 16.3%, 46.9%); color:
  hsl(215.4, 16.3%, 46.9%);

**Tertiary/Ghost Button**

**Use Case:** Subtle actions ("Edit," "Duplicate," "More Options")

**States:**

- **Default:** background: transparent; color: hsl(215.4, 16.3%, 46.9%);
  padding: 8px 16px;

- **Hover:** background: hsl(210, 40%, 96%); color: hsl(220, 25.7%,
  13.7%);

- **Focus:** Standard focus ring with muted background

- **Active:** background: hsl(210, 40%, 93%);

**Destructive Button**

**Use Case:** Dangerous actions ("Delete Prompt," "Remove Files,"
"Clear History")

**States:**

- **Default:** background: hsl(0, 76.3%, 57.1%); color: white;

- **Hover:** background: hsl(0, 84%, 50%); box-shadow: 0 4px 12px
  rgba(239, 68, 68, 0.3);

- **Focus:** box-shadow: 0 0 0 2px hsl(0, 76.3%, 57.1%);

**3.2. Form Elements**

**Input Fields**

**Use Case:** Text entry, search, prompt content, file paths

**Visual Anatomy:** Rounded rectangle with subtle border, comfortable
padding, clear typography.

**States:**

- **Default:** border: 1px solid hsl(216, 12.2%, 83.9%); background:
  white; padding: 12px 16px; border-radius: 8px; font-size: 16px;

- **Focus:** border-color: #377674; box-shadow: 0 0 0 2px rgba(55, 118,
  116, 0.2);

- **Error:** border-color: hsl(0, 76.3%, 57.1%); box-shadow: 0 0 0 2px
  rgba(239, 68, 68, 0.2);

- **Disabled:** background: hsl(210, 40%, 96%); color: hsl(215.4, 16.3%,
  46.9%);

**Textarea (Prompt Editor)**

**Use Case:** Multi-line prompt content, system instructions, context

**Enhanced Features:**

- Syntax highlighting for prompt variables {{variable}}

- Auto-resize based on content

- Character/token count display

- Monospace font option toggle

**Select Dropdown**

**Use Case:** Model selection, template categories, file type filters

**States:**

- **Closed:** Appears as input field with dropdown arrow

- **Open:** Overlay panel with scrollable options, search filtering for
  long lists

- **Selected:** Highlighted option with Primary Green background

**Checkboxes & Toggles**

**Use Case:** File selection, feature toggles, multi-model execution

**Checkbox States:**

- **Unchecked:** border: 2px solid hsl(216, 12.2%, 83.9%); background:
  white;

- **Checked:** background: #377674; border-color: #377674; color:
  white; with checkmark icon

- **Indeterminate:** Dash icon for partial selections in file trees

**Toggle States:**

- **Off:** background: hsl(215.4, 16.3%, 46.9%); slider positioned left

- **On:** background: #377674; slider positioned right with smooth
  transition

**3.3. Cards**

**PromptCard (Core Component)**

**Use Case:** Display prompt templates, execution history, community
prompts

**Visual Anatomy:**

- **Header:** Title, author/source, quick actions (bookmark, share,
  more)

- **Body:** Prompt preview, tags, description, key metrics

- **Footer:** Usage stats, last modified, execution button

**States:**

- **Default:** background: white; border: 1px solid hsl(216, 12.2%,
  83.9%); border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px
  rgba(0, 0, 0, 0.05);

- **Hover:** border-color: #377674; box-shadow: 0 8px 25px rgba(55, 118,
  116, 0.15); transform: translateY(-2px);

- **Selected:** border-color: #377674; border-width: 2px; box-shadow: 0
  0 0 2px rgba(55, 118, 116, 0.2);

- **Loading:** Skeleton animation in body content area

**StatCard**

**Use Case:** Analytics dashboard, usage metrics, cost tracking

**Visual Features:**

- Large numerical display with trend indicator

- Subtitle with context

- Optional chart/graph integration

- Color-coded based on metric type (green for positive trends, red for
  concerning metrics)

**ProfileCard**

**Use Case:** User profiles, team member display, author attribution

**Components:**

- Avatar (circular, 40px default)

- Name and title

- Badge indicators (Premium, Verified, etc.)

- Quick action buttons

**3.4. Navigation**

**Header Navigation**

**Visual Structure:** Fixed top bar with logo, search, main navigation
tabs, user menu

**Components:**

- **Logo:** "PigeonPrompt" with subtle brand gradient text effect

- **Search:** Expandable search bar with recent searches dropdown

- **Navigation Tabs:** Workspace, Discover, Analytics, Settings

- **User Menu:** Avatar, notifications bell, settings gear

**Active States:**

- **Active Tab:** Bold font weight, 3px bottom border in Primary Green

- **Hover Tab:** Background tint of rgba(55, 118, 116, 0.1)

**Collapsible Sidebar**

**Use Case:** File explorer, template library, execution history

**Visual Features:**

- 280px width when expanded, 64px when collapsed

- Smooth accordion animation (300ms)

- Sections with collapsible headers

- Drag-and-drop reordering for custom items

**States:**

- **Expanded:** Full labels, nested tree structure visible

- **Collapsed:** Icons only, tooltip labels on hover

- **Active Item:** Primary Green background tint, white text

**Tabs**

**Use Case:** Sectioned content within pages, prompt editor sections

**Styles:**

- **Default:** border-bottom: 2px solid transparent; padding: 12px 16px;

- **Active:** border-bottom-color: #377674; font-weight: 600;

- **Hover:** background: rgba(55, 118, 116, 0.05);

**Pagination**

**Use Case:** Prompt library, execution history, search results

**Components:**

- Previous/Next buttons

- Page numbers (show 5 around current)

- Jump to first/last

- Results per page selector

**Active Page Style:** Primary button styling with brand gradient
background

**3.5. Modals & Dialogs**

**Modal Structure**

**Components:**

- **Overlay:** background: rgba(0, 0, 0, 0.5); with backdrop blur effect

- **Content Box:** Centered, max-width 600px, white background, large
  border radius

- **Header:** Title, close X button

- **Body:** Scrollable content area

- **Footer:** Action buttons (right-aligned)

**Animation:** Scale up from 90% with fade-in (300ms)

**Specialized Modals**

- **File Connection Modal:** File system permissions, folder selection
  UI

- **Template Creator:** Multi-step wizard with progress indicator

- **Share Dialog:** Permission settings, link generation, team member
  selection

- **Confirmation Dialog:** Clear warning text, destructive action
  emphasis

**3.6. Notifications & Toasts**

**Toast Positioning**

Fixed position top-right, stacked vertically with 8px gaps

**Variants**

- **Success:** Green background with checkmark icon

- **Error:** Red background with X circle icon

- **Warning:** Amber background with alert triangle icon

- **Info:** Blue background with info circle icon

**Auto-dismiss:** 5 seconds for success/info, manual dismiss for
errors/warnings

**Notification Center**

Accessible via header bell icon, includes:

- Team activity feed

- System updates

- Prompt execution completions

- Community interactions (likes, comments, forks)

**3.7. Badges & Pills**

**Status Badges**

**Use Cases:** User roles, prompt categories, file types, execution
status

**Styles:**

- **Default:** background: hsl(210, 40%, 96%); color: hsl(215.4, 16.3%,
  46.9%); padding: 4px 8px; border-radius: 4px; font-size: 12px;

- **Premium:** background: linear-gradient(135deg, #569f89, #377674);
  color: white;

- **Success:** background: hsl(142.1, 76.2%, 36.3%); color: white;

- **Warning:** background: hsl(37.7, 92.1%, 50.2%); color: white;

**Category Pills**

**Use Case:** Prompt tags, skill filters, search facets

**Features:**

- Removable with X icon

- Hover effects for interactive versions

- Color coding by category type

- Clickable for filtering

**4. Page Layouts & User Experience Flows**

**4.1. Dashboard Layout**

**User Goal**

Quick access to recent work, team activity, and key metrics

**Layout Structure**

**Grid System:** 3-column layout on desktop, single column on mobile

**Left Column (Sidebar - 280px):**

- Collapsible file explorer

- Recent projects

- Template library

- Execution history

**Center Column (Main Content):**

- Header with search and navigation

- Quick actions panel

- Recent prompts grid (2x3 cards)

- Team activity feed

**Right Column (Info Panel - 320px):**

- Usage analytics summary

- Community highlights

- Quick tips and tutorials

**Key States**

**Loading State:** Skeleton cards with shimmer animation, maintaining
layout structure while content loads. Key elements like navigation
remain interactive.

**Empty State (New User):** Welcoming illustration of a pigeon with
speech bubble saying "Ready to craft amazing prompts?"

Primary action: "Connect Your First Project" (prominent button with
brand gradient)

Secondary actions: "Explore Community Templates" and "Watch Quick
Tutorial"

**Error State:** Friendly error message: "Something went wrong, but
your work is safe." Action buttons: "Try Again" and "Contact
Support" Local work status indicator showing offline capabilities

**Onboarding Flow**

**Step 1:** Welcome modal with value proposition **Step 2:** File system
permission request with clear explanation **Step 3:** Guided first
project connection **Step 4:** Template selection from curated starter
pack **Step 5:** First prompt execution with progress explanation **Step
6:** Result review and next steps suggestion

**4.2. Prompt Studio Layout**

**User Goal**

Craft, test, and refine prompts with full context awareness

**Layout Structure**

**Responsive 2-Panel Design:**

**Left Panel (60% width):**

- Tabbed prompt editor (System, User, Context, Examples, Output)

- Live token counter with model compatibility indicators

- Quick action toolbar (save, copy, export)

**Right Panel (40% width):**

- Connected files tree with selection controls

- Model selection and parameters

- Execution results with streaming output

- History and version sidebar

**Key States**

**Loading State:**

- File tree: Skeleton folders and files with loading spinners

- Editor: Disabled with "Loading context..." message

- Results: "Preparing execution environment..." with animated dots

**Empty State:** "Your prompt canvas awaits"

- Empty editor with placeholder text and formatting hints

- Suggested templates carousel

- "Connect files to supercharge your context" call-to-action

**Error State:** Context-aware error messages:

- File access: "Can't read project files. Check permissions and
  refresh."

- Execution: "Model temporarily unavailable. Try another model or wait
  a moment."

- Token limit: "Prompt too long. Try file snippets instead of full
  files."

**4.3. Community Discovery Page**

**User Goal**

Find, evaluate, and adopt proven prompts from the community

**Layout Structure**

**Header Section:**

- Search bar with advanced filters

- Category tabs (Development, Content, Analysis, etc.)

- Sort options (Popular, Recent, Trending, Rating)

**Main Grid:**

- Responsive card grid (3 columns desktop, 2 tablet, 1 mobile)

- Infinite scroll with smooth loading

- Filter sidebar (collapsible on mobile)

**Prompt Detail Modal:**

- Full prompt preview with syntax highlighting

- Author information and stats

- Usage examples and success metrics

- Community ratings and comments

- Fork/copy actions

**Key States**

**Loading State:** Progressive loading with skeleton cards maintaining
grid layout. Search and filters remain interactive during content
loading.

**Empty State (No Results):** "No prompts match your search"

- Suggested alternatives based on similar terms

- "Browse popular prompts" fallback action

- "Submit a prompt" community contribution call-to-action

**Error State:** "Community temporarily unavailable"

- Cached/offline prompt access if available

- "Try again" action with automatic retry indication

**4.4. Analytics Dashboard**

**User Goal**

Understand usage patterns, costs, and optimization opportunities

**Layout Structure**

**Summary Row:**

- Key metrics cards (total executions, cost this month, success rate,
  token efficiency)

- Trend indicators and period comparison

**Chart Section:**

- Interactive time series for usage and costs

- Model performance comparison

- Team activity breakdown (for team plans)

**Insights Panel:**

- AI-generated optimization suggestions

- Cost forecasting

- Usage pattern alerts

**Key States**

**Loading State:** Chart areas show skeleton graphs maintaining
proportions. Summary cards load progressively with actual data.

**Empty State (Insufficient Data):** "Your analytics story begins
here"

- Explanation of metrics and their value

- "Execute your first prompt" primary action

- Sample dashboard preview for demonstration

**Error State:** "Analytics temporarily unavailable"

- Last cached data display with timestamp

- Manual refresh option

- Status indicator for data freshness

**4.5. Settings & Configuration**

**User Goal**

Customize experience, manage account, configure integrations

**Layout Structure**

**Tabbed Interface:**

- Profile & Preferences

- Team & Workspace (for team accounts)

- Billing & Usage

- API Keys & Integrations

- Privacy & Security

**Responsive Form Layout:**

- Clear section headers

- Grouped related settings

- Immediate feedback for changes

- Confirmation for destructive actions

**Key States**

**Loading State:** Form sections load progressively with skeleton inputs
maintaining layout structure.

**Empty State (New Account):** Welcome wizard approach with step-by-step
setup guidance and recommended configurations.

**Error State:** Field-level error messages with specific guidance for
resolution. Global error handling for connectivity issues.

**5. Accessibility (WCAG 2.1 AA) & Responsiveness**

**5.1. Keyboard Navigation**

**Tab Order Hierarchy**

1.  **Skip Links:** "Skip to main content," "Skip to navigation"

2.  **Header Navigation:** Logo, search, main tabs, user menu

3.  **Sidebar Navigation:** File tree, templates, history (when
    expanded)

4.  **Main Content:** Primary actions, content cards, interactive
    elements

5.  **Footer:** Secondary links, legal information

**Keyboard Shortcuts**

- **Global:** / focus search, Esc close modals/dropdowns

- **Prompt Studio:** Ctrl+S save, Ctrl+Enter execute, Ctrl+K command
  palette

- **Navigation:** Alt+1-4 switch main tabs, Ctrl+B toggle sidebar

**Focus Management**

- Clear 2px focus rings using hsl(178.1, 36.4%, 33.9%)

- Focus trapping in modals

- Logical focus return after modal close

- Skip links for lengthy navigation sections

**5.2. Screen Reader Support**

**Semantic HTML Structure**

- Proper heading hierarchy (h1-h6) without skipping levels

- Landmark regions: <main>, <nav>, <aside>, <section>

- Lists for navigation and repeated content

- Form labels properly associated with inputs

**ARIA Labels & Descriptions**

- Icon-only buttons: aria-label="Save prompt"

- Complex widgets: aria-describedby for usage instructions

- Dynamic content: aria-live regions for status updates

- File tree: aria-expanded and aria-selected states

**Status Announcements**

- Prompt execution progress: "Executing prompt... 50% complete"

- Form validation: "Error: Password must be at least 8 characters"

- Success actions: "Prompt saved successfully"

**5.3. Responsive Design**

**Breakpoint Strategy**

- **Mobile First:** Base styles for mobile, enhance for larger screens

- **Progressive Enhancement:** Core functionality works across all
  devices

- **Content Priority:** Most important content and actions remain
  accessible

**Mobile Adaptations (< 768px)**

- **Navigation:** Hamburger menu with slide-out drawer

- **Sidebar:** Overlay mode instead of persistent panel

- **Cards:** Single column with simplified layout

- **Forms:** Stacked labels, larger touch targets (44px minimum)

- **Tables:** Horizontal scroll or card transformation

**Tablet Adaptations (768px - 1024px)**

- **Navigation:** Condensed horizontal tab bar

- **Layout:** 2-column grid where appropriate

- **Sidebar:** Collapsible with icon-only mode

- **Touch Optimization:** Larger buttons and spacing

**Desktop Enhancements (> 1024px)**

- **Multi-panel Layouts:** Full sidebar + main content + info panel

- **Hover States:** Rich hover effects and tooltips

- **Keyboard Shortcuts:** Full shortcut support with visual indicators

- **Dense Information:** More content per screen without overwhelming

**Touch & Interaction**

- **Minimum Touch Target:** 44px for interactive elements

- **Gesture Support:** Swipe for navigation on mobile

- **Hover Alternatives:** Tap-and-hold for tooltip content on touch
  devices

- **Responsive Images:** Appropriate sizing and loading for device
  capabilities

**5.4. Performance Considerations**

**Loading Strategies**

- **Critical CSS:** Inline critical path styles for fast first paint

- **Progressive Enhancement:** Core functionality loads first,
  enhancements follow

- **Image Optimization:** WebP format with fallbacks, lazy loading

- **Code Splitting:** Route-based and component-based splitting

**Accessibility Performance**

- **Screen Reader Efficiency:** Proper heading structure for quick
  navigation

- **Reduced Motion:** Respect prefers-reduced-motion for animations

- **High Contrast:** Support for prefers-contrast: high

- **Focus Performance:** Ensure focus indicators appear immediately

This comprehensive design specification provides the foundation for
building a world-class prompt engineering platform that balances
sophisticated functionality with intuitive usability. Every component,
state, and interaction has been carefully considered to create a
cohesive experience that empowers users to craft exceptional AI prompts
efficiently and collaboratively.
