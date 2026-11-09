-- ============================================================================
-- TOEIC MASTER AI - PostgreSQL Database Schema & Initial Migration
-- Migration: 001_initial_schema.sql
-- Description: Core tables for User & Learning, Documents, Vocabulary & Lexical
--              Relations, Grammar & Tips, Exams, Mistake Records, and Analytics.
-- ============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USER & LEARNING
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'learner' CHECK (role IN ('learner', 'instructor', 'admin')),
    target_score INT DEFAULT 750,
    current_level VARCHAR(32) DEFAULT 'Intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    daily_goal_cards INT DEFAULT 20,
    daily_goal_minutes INT DEFAULT 30,
    streak_count INT DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_goals (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    target_score INT NOT NULL,
    current_estimated_score INT DEFAULT 450,
    deadline DATE,
    daily_study_minutes INT DEFAULT 30,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(64) NOT NULL, -- 'flashcard_review', 'exam_practice', 'tips_study', 'vocab_quiz'
    duration_seconds INT DEFAULT 0,
    items_studied INT DEFAULT 0,
    score NUMERIC(5,2),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS learning_events (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. DOCUMENTS & INGESTION REPOSITORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS source_documents (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'TOEIC-001', 'TOEIC-002', 'TOEIC-003', 'TOEIC-004', 'TOEIC-005'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_pages INT DEFAULT 1,
    category VARCHAR(64),
    verification_status VARCHAR(32) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'flagged', 'archived')),
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS source_pages (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES source_documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    raw_text TEXT,
    verified_status VARCHAR(32) DEFAULT 'verified',
    notes TEXT,
    CONSTRAINT uq_doc_page UNIQUE (document_id, page_number)
);

CREATE TABLE IF NOT EXISTS import_jobs (
    id VARCHAR(64) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(32) NOT NULL,
    total_items INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_review_queue (
    id VARCHAR(64) PRIMARY KEY,
    item_type VARCHAR(64) NOT NULL, -- 'vocabulary', 'lexical_relation', 'strategy_tip', 'question'
    raw_data JSONB NOT NULL,
    normalized_data JSONB,
    flags TEXT[],
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modified')),
    reviewed_by VARCHAR(64) REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. VOCABULARY, SENSES & LEXICAL RELATIONS (SYNONYMS / ANTONYMS / PARAPHRASES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vocabulary_entries (
    id VARCHAR(64) PRIMARY KEY,
    word VARCHAR(128) NOT NULL,
    ipa VARCHAR(128),
    part_of_speech VARCHAR(32) NOT NULL, -- 'verb', 'noun', 'adjective', 'adverb', 'phrase', 'preposition'
    cefr_level VARCHAR(8) DEFAULT 'B1' CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    priority_level VARCHAR(16) DEFAULT 'Priority 1' CHECK (priority_level IN ('Priority 1', 'Priority 2', 'Priority 3')),
    audio_url TEXT,
    definition_vi TEXT NOT NULL,
    definition_en TEXT,
    example_en TEXT NOT NULL,
    example_vi TEXT NOT NULL,
    topic VARCHAR(64) DEFAULT 'General Business',
    toeic_part VARCHAR(32) DEFAULT 'Part 5',
    source_doc VARCHAR(64) DEFAULT 'TOEIC-003',
    source_page INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vocabulary_senses (
    id VARCHAR(64) PRIMARY KEY,
    vocab_id VARCHAR(64) REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
    sense_order INT DEFAULT 1,
    context_domain VARCHAR(128) NOT NULL, -- e.g. 'Lịch trình / Cuộc họp', 'Hàng hóa / Kho bãi'
    definition_vi TEXT NOT NULL,
    definition_en TEXT,
    notes TEXT
);

-- Mandatory multi-column lexical relations table (no bundled strings)
CREATE TABLE IF NOT EXISTS lexical_relations (
    id VARCHAR(64) PRIMARY KEY,
    source_vocab_sense_id VARCHAR(64) REFERENCES vocabulary_senses(id) ON DELETE CASCADE,
    target_phrase VARCHAR(128) NOT NULL,
    relation_type VARCHAR(32) NOT NULL CHECK (relation_type IN ('synonym', 'antonym', 'paraphrase', 'collocation', 'word_family', 'related')),
    context VARCHAR(255) NOT NULL,
    interchangeability VARCHAR(32) DEFAULT 'conditional' CHECK (interchangeability IN ('exact', 'near', 'conditional', 'none')),
    usage_level VARCHAR(32) DEFAULT 'Cao' CHECK (usage_level IN ('Cao', 'Trung bình', 'Thấp')),
    priority VARCHAR(16) DEFAULT 'Priority 1' CHECK (priority IN ('Priority 1', 'Priority 2', 'Priority 3')),
    supporting_example TEXT,
    source_reference VARCHAR(128),
    verification_status VARCHAR(32) DEFAULT 'verified' CHECK (verification_status IN ('verified', 'context-dependent', 'needs_review', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vocabulary_examples (
    id VARCHAR(64) PRIMARY KEY,
    vocab_id VARCHAR(64) REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
    sentence_en TEXT NOT NULL,
    sentence_vi TEXT NOT NULL,
    part_tag VARCHAR(16) DEFAULT 'Part 5',
    highlight_word VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS collocations (
    id VARCHAR(64) PRIMARY KEY,
    vocab_id VARCHAR(64) REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
    phrase VARCHAR(255) NOT NULL,
    meaning_vi TEXT NOT NULL,
    example TEXT
);

CREATE TABLE IF NOT EXISTS word_families (
    id VARCHAR(64) PRIMARY KEY,
    root_word VARCHAR(128) NOT NULL,
    noun VARCHAR(128),
    verb VARCHAR(128),
    adjective VARCHAR(128),
    adverb VARCHAR(128),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS flashcard_decks (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    is_preset BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flashcard_deck_items (
    deck_id VARCHAR(64) REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    vocab_id VARCHAR(64) REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (deck_id, vocab_id)
);

-- Spaced Repetition (FSRS / SM-2 based state tracking)
CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    vocab_id VARCHAR(64) REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
    repetition_count INT DEFAULT 0,
    lapse_count INT DEFAULT 0,
    stability NUMERIC(5,2) DEFAULT 1.0,
    difficulty NUMERIC(5,2) DEFAULT 5.0,
    interval_days INT DEFAULT 0,
    last_rating VARCHAR(16), -- 'again', 'hard', 'good', 'easy'
    state VARCHAR(16) DEFAULT 'new' CHECK (state IN ('new', 'learning', 'reviewing', 'mastered')),
    retention_rate NUMERIC(5,2) DEFAULT 0.0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_vocab_review UNIQUE (user_id, vocab_id)
);

-- ----------------------------------------------------------------------------
-- 4. GRAMMAR & STRATEGY TIPS (PARTS 1-7)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grammar_topics (
    id VARCHAR(64) PRIMARY KEY,
    topic_code VARCHAR(64) UNIQUE NOT NULL, -- 'NOUNS_ADJ', 'TENSES', 'PREPOSITIONS', etc.
    title_vi VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    explanation_vi TEXT NOT NULL,
    structures JSONB,
    common_traps JSONB,
    part_relevance VARCHAR(64) DEFAULT 'Part 5, 6',
    source_ref VARCHAR(64) DEFAULT 'TOEIC-001'
);

CREATE TABLE IF NOT EXISTS strategy_tips (
    id VARCHAR(64) PRIMARY KEY,
    tip_code VARCHAR(64) UNIQUE NOT NULL,
    part_number INT NOT NULL CHECK (part_number BETWEEN 1 AND 7),
    category VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    example TEXT NOT NULL,
    source VARCHAR(128) DEFAULT 'TOEIC-002',
    evidence_status VARCHAR(32) DEFAULT 'verified' CHECK (evidence_status IN ('verified', 'context-dependent', 'needs_review', 'rejected')),
    confidence_level VARCHAR(32) DEFAULT 'high' CHECK (confidence_level IN ('high', 'medium', 'low')),
    conditions TEXT,
    common_misinterpretations TEXT
);

-- ----------------------------------------------------------------------------
-- 5. EXAMS, SESSIONS, QUESTIONS & MISTAKES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tests (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    test_type VARCHAR(32) NOT NULL CHECK (test_type IN ('full_test', 'mini_test', 'part_practice', 'topic_practice')),
    total_questions INT NOT NULL,
    duration_minutes INT NOT NULL,
    target_score INT DEFAULT 750,
    difficulty VARCHAR(32) DEFAULT 'Medium',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_sections (
    id VARCHAR(64) PRIMARY KEY,
    test_id VARCHAR(64) REFERENCES tests(id) ON DELETE CASCADE,
    part_number INT NOT NULL CHECK (part_number BETWEEN 1 AND 7),
    section_name VARCHAR(128) NOT NULL,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS passages (
    id VARCHAR(64) PRIMARY KEY,
    section_id VARCHAR(64) REFERENCES test_sections(id) ON DELETE CASCADE,
    passage_type VARCHAR(64) DEFAULT 'single_passage', -- 'conversation', 'talk', 'email', 'memo', 'notice', 'double_passage'
    title VARCHAR(255),
    passage_text TEXT,
    image_url TEXT,
    audio_url TEXT
);

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    test_id VARCHAR(64) REFERENCES tests(id) ON DELETE CASCADE,
    section_id VARCHAR(64) REFERENCES test_sections(id) ON DELETE CASCADE,
    passage_id VARCHAR(64) REFERENCES passages(id) ON DELETE SET NULL,
    question_number INT NOT NULL,
    part_number INT NOT NULL CHECK (part_number BETWEEN 1 AND 7),
    prompt_en TEXT NOT NULL,
    audio_url TEXT,
    image_url TEXT,
    transcript TEXT,
    explanation_vi TEXT NOT NULL,
    explanation_en TEXT,
    trap_type VARCHAR(64),
    evidence_quote TEXT,
    paraphrase_note TEXT
);

CREATE TABLE IF NOT EXISTS answer_options (
    id VARCHAR(64) PRIMARY KEY,
    question_id VARCHAR(64) REFERENCES questions(id) ON DELETE CASCADE,
    option_label CHAR(1) NOT NULL CHECK (option_label IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    distractor_reason TEXT,
    CONSTRAINT uq_question_opt UNIQUE (question_id, option_label)
);

CREATE TABLE IF NOT EXISTS test_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    test_id VARCHAR(64) REFERENCES tests(id) ON DELETE CASCADE,
    mode VARCHAR(32) DEFAULT 'practice' CHECK (mode IN ('exam_timed', 'practice', 'review')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    raw_score_listening INT DEFAULT 0,
    raw_score_reading INT DEFAULT 0,
    scaled_score INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_answers (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(64) REFERENCES questions(id) ON DELETE CASCADE,
    selected_option CHAR(1),
    is_correct BOOLEAN DEFAULT FALSE,
    time_spent_seconds INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mistake_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(64) REFERENCES questions(id) ON DELETE CASCADE,
    error_category VARCHAR(64) NOT NULL CHECK (error_category IN (
        'Vocabulary', 'Grammar', 'Word Form', 'Collocation', 
        'Listening Comprehension', 'Paraphrasing', 'Inference', 
        'Detail Identification', 'Time Management', 'Other/Uncertain'
    )),
    notes TEXT,
    confidence_score NUMERIC(3,2) DEFAULT 0.90,
    resolved BOOLEAN DEFAULT FALSE,
    reviewed_count INT DEFAULT 0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. LEARNING ANALYTICS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS performance_summaries (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    part_number INT NOT NULL CHECK (part_number BETWEEN 1 AND 7),
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    avg_time_seconds NUMERIC(6,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_part_perf UNIQUE (user_id, part_number)
);

CREATE TABLE IF NOT EXISTS vocabulary_mastery (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    total_mastered INT DEFAULT 0,
    total_reviewing INT DEFAULT 0,
    total_learning INT DEFAULT 0,
    retention_rate NUMERIC(5,2) DEFAULT 0.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR HIGH-EFFICIENCY QUERIES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_vocab_word ON vocabulary_entries(word);
CREATE INDEX IF NOT EXISTS idx_vocab_topic ON vocabulary_entries(topic);
CREATE INDEX IF NOT EXISTS idx_vocab_priority ON vocabulary_entries(priority_level);
CREATE INDEX IF NOT EXISTS idx_lex_relations_target ON lexical_relations(target_phrase);
CREATE INDEX IF NOT EXISTS idx_lex_relations_type ON lexical_relations(relation_type);
CREATE INDEX IF NOT EXISTS idx_reviews_next ON flashcard_reviews(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_mistakes_user_cat ON mistake_records(user_id, error_category);
CREATE INDEX IF NOT EXISTS idx_questions_part ON questions(part_number);
CREATE INDEX IF NOT EXISTS idx_user_answers_session ON user_answers(session_id);
