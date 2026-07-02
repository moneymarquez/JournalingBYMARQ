# Storyline - Book Journaling App TODO

## Phase 1: Core Setup & Data Model
- [x] Create database schema for entries, clips, and related data
- [x] Set up tRPC procedures for CRUD operations on entries
- [x] Create database helpers for queries
- [x] Set up Anthropic API integration for AI writing tools

## Phase 2: Layout & Navigation
- [x] Build 3-panel layout (sidebar, middle, detail)
- [x] Create sidebar with logo, nav links, filters, word count
- [x] Create navigation routes: All Entries, Timeline, Clips Board, Progress
- [x] Implement responsive layout structure

## Phase 3: Middle Panel (Entry List)
- [x] Build entry list with search functionality (title, content, tags)
- [x] Create tag filter pills
- [x] Build entry cards with category dots, word count, date
- [x] Implement pinned entries appearing at top
- [x] Add create new entry button

## Phase 4: Detail Panel (View & Edit)
- [x] Build full entry view display
- [x] Implement edit mode with Save/Cancel buttons
- [x] Add pin/unpin button
- [x] Add "Clip to Clips Board" button (120-char snippet)
- [x] Build related entries section (matching shared tags)

## Phase 5: AI Writing Tools (Spice It Up)
- [x] Build AI side panel UI with 6 writing tools
- [x] Implement "✨ Spice It Up" - rewrite with tension/sensory detail
- [x] Implement "💬 Sharpen Dialogue" - make dialogue snappier
- [x] Implement "🌀 Suggest a Twist" - 3 unexpected plot turns
- [x] Implement "📖 Expand This" - turn note into full scene draft
- [x] Implement "⚡ Add Conflict" - ways to raise stakes
- [x] Implement "🎭 Deepen Character" - uncover new character layer
- [x] Add Copy to Clipboard button for results
- [x] Test API integration with claude-sonnet-4-6

## Phase 6: Timeline View
- [x] Build chronological entry list
- [x] Add color-coded category dots
- [x] Add connecting lines between entries
- [x] Implement filtering/sorting

## Phase 7: Clips Board View
- [x] Build clips display with source entry title
- [x] Add remove button for each clip
- [x] Implement clip management

## Phase 8: Progress View
- [x] Display total word count
- [x] Build progress bar toward 80k goal
- [x] Show entries per category breakdown
- [x] Add visual progress indicators

## Phase 9: Sample Data & Polish
- [x] Load 6 sample entries about Margaret's novel
- [x] Apply warm parchment design (colors, fonts)
- [x] Test all features end-to-end
- [x] Polish UI/UX and animations

## Phase 10: Testing & Delivery
- [x] Write vitest tests for core functionality
- [x] Test all CRUD operations
- [x] Test AI integration (Claude Sonnet 4.6 verified)
- [x] Verify responsive design
- [x] Final polish and delivery

## Phase 11: AI Chat Section
- [x] Create AI Chat router with conversation streaming
- [x] Build AI Chat UI component with message history
- [x] Add save-to-entry functionality from chat
- [x] Integrate AI Chat into navigation
- [x] Test AI Chat and save checkpoint

## Phase 12: Book View Feature
- [x] Create BookView component to display all entries assembled together
- [x] Add sorting options: chronological, by chapter/section, by category, custom order
- [x] Add print/export functionality for the assembled book
- [x] Integrate Book View into navigation
- [x] Test Book View and save checkpoint

## Phase 13: Visual Redesign - Book on Desk Theme
- [x] Redesign background with dark walnut wood texture
- [x] Style sidebar as book spine with leather brown and cream text
- [x] Style middle panel as left book page with aged ivory and ruled lines
- [x] Style detail panel as right book page with fresh white
- [x] Update all category colors to new ink palette
- [x] Add bookmark ribbon styling for pinned entries
- [x] Update button styles to ink stamp look
- [x] Update AI panel styling to match book theme
- [x] Add drop shadow to main app container for lifted book effect
- [x] Test all styling across different views
- [x] Make app full screen (remove padding and centered layout)
