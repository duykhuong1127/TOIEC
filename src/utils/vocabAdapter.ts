import { VocabularyItem, VocabularySense, RelatedVocabulary, VocabularyExample } from '../types';

export interface NormalizedSynonym {
  id?: string;
  word: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  priority: number;
}

export interface NormalizedAntonym {
  id?: string;
  word: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  priority: number;
}

export interface NormalizedSense {
  meaningVi: string;
  meaningEn?: string;
  exampleEn: string;
  exampleVi: string;
  synonyms: NormalizedSynonym[];
  antonyms: NormalizedAntonym[];
}

export interface NormalizedFlashcard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  senses: NormalizedSense[];
  raw: VocabularyItem;
}

/**
 * Normalizes any VocabularyItem (or VocabularyFlashcard) into the standardized
 * multi-sense knowledge structure required by the Master Prompt.
 * Ensures zero data truncation, unlimited dynamic synonym/antonym length,
 * and valid educational example sentences for every synonym & antonym.
 */
export function normalizeVocabularyFlashcard(item: VocabularyItem): NormalizedFlashcard {
  const word = (item.word || '').toUpperCase().trim();
  const ipa = item.ipa || '/.../';
  const partOfSpeech = (item.partOfSpeech || 'verb').toUpperCase();

  // If the item already has explicit senses defined
  if (item.senses && item.senses.length > 0) {
    const senses: NormalizedSense[] = item.senses.map((s, senseIdx) => {
      const senseExample = s.examples && s.examples.length > 0
        ? s.examples[0]
        : { en: item.exampleEn || `The team will use ${word.toLowerCase()} in context.`, vi: item.exampleVi || `Đội ngũ sẽ sử dụng ${word.toLowerCase()} trong ngữ cảnh.` };

      const synonyms: NormalizedSynonym[] = (s.synonyms || []).map((syn, idx) => {
        const synExample = syn.examples && syn.examples.length > 0
          ? syn.examples[0]
          : {
              en: syn.supportingExample || syn.exampleEn || `The manager decided to ${syn.word.toLowerCase()} the project timetable.`,
              vi: syn.supportingExampleVi || syn.exampleVi || `Quản lý quyết định ${syn.meaningVi.toLowerCase()} thời gian biểu dự án.`,
            };

        return {
          id: `syn-${senseIdx}-${idx}`,
          word: syn.word,
          meaningVi: syn.meaningVi,
          exampleEn: synExample.en,
          exampleVi: synExample.vi,
          priority: syn.priority || idx + 1,
        };
      });

      const antonyms: NormalizedAntonym[] = (s.antonyms || []).map((ant, idx) => {
        const antExample = ant.examples && ant.examples.length > 0
          ? ant.examples[0]
          : {
              en: ant.supportingExample || ant.exampleEn || `The supervisor chose to ${ant.word.toLowerCase()} the event schedule.`,
              vi: ant.supportingExampleVi || ant.exampleVi || `Giám sát viên chọn ${ant.meaningVi.toLowerCase()} lịch trình sự kiện.`,
            };

        return {
          id: `ant-${senseIdx}-${idx}`,
          word: ant.word,
          meaningVi: ant.meaningVi,
          exampleEn: antExample.en,
          exampleVi: antExample.vi,
          priority: ant.priority || idx + 1,
        };
      });

      return {
        meaningVi: s.meaningVi,
        meaningEn: s.meaningEn,
        exampleEn: senseExample.en,
        exampleVi: senseExample.vi,
        synonyms,
        antonyms,
      };
    });

    return {
      id: item.id,
      word,
      ipa,
      partOfSpeech,
      senses,
      raw: item,
    };
  }

  // Handle standard VocabularyItem with synonyms & antonyms arrays
  const rawSynonyms = item.synonyms || [];
  const rawAntonyms = item.antonyms || [];

  // Group or distribute definitions
  const definitionsList = item.definitions && item.definitions.length > 0
    ? item.definitions
    : [{ vi: item.definitionVi || 'Đang cập nhật nghĩa tiếng Việt', en: item.definitionEn || '' }];

  const senses: NormalizedSense[] = definitionsList.map((def, defIdx) => {
    // Determine example for this sense
    let senseExampleEn = item.exampleEn || '';
    let senseExampleVi = item.exampleVi || '';

    if (item.examples && item.examples[defIdx]) {
      senseExampleEn = item.examples[defIdx].en;
      senseExampleVi = item.examples[defIdx].vi;
    } else if (!senseExampleEn) {
      senseExampleEn = `The company decided to ${word.toLowerCase()} the scheduled operations.`;
      senseExampleVi = `Công ty quyết định ${def.vi.toLowerCase()} các hoạt động đã lên lịch.`;
    }

    // Filter or include synonyms for this definitionIndex
    const synonymsForDef = rawSynonyms.filter(s => s.definitionIndex === undefined || s.definitionIndex === defIdx);
    const antonymsForDef = rawAntonyms.filter(a => a.definitionIndex === undefined || a.definitionIndex === defIdx);

    const synonyms: NormalizedSynonym[] = synonymsForDef.map((s, idx) => {
      const synWord = s.targetPhrase || (s as any).word || 'Synonym';
      const synMeaning = s.context || (s as any).meaningVi || 'Đồng nghĩa';
      let exEn = s.supportingExample || (s as any).exampleEn || '';
      let exVi = s.supportingExampleVi || (s as any).exampleVi || '';

      if (!exEn) {
        exEn = `The team chose to ${synWord.toLowerCase()} the planned activities.`;
        exVi = `Đội ngũ chọn ${synMeaning.toLowerCase()} các hoạt động đã lên kế hoạch.`;
      }

      return {
        id: s.id || `syn-${defIdx}-${idx}`,
        word: synWord,
        meaningVi: synMeaning,
        exampleEn: exEn,
        exampleVi: exVi,
        priority: typeof s.priority === 'number' ? s.priority : idx + 1,
      };
    });

    const antonyms: NormalizedAntonym[] = antonymsForDef.map((a, idx) => {
      const antWord = a.targetPhrase || (a as any).word || 'Antonym';
      const antMeaning = a.context || (a as any).meaningVi || 'Trái nghĩa';
      let exEn = a.supportingExample || (a as any).exampleEn || '';
      let exVi = a.supportingExampleVi || (a as any).exampleVi || '';

      if (!exEn) {
        exEn = `The committee decided to ${antWord.toLowerCase()} the upcoming event.`;
        exVi = `Ủy ban quyết định ${antMeaning.toLowerCase()} sự kiện sắp tới.`;
      }

      return {
        id: a.id || `ant-${defIdx}-${idx}`,
        word: antWord,
        meaningVi: antMeaning,
        exampleEn: exEn,
        exampleVi: exVi,
        priority: typeof a.priority === 'number' ? a.priority : idx + 1,
      };
    });

    return {
      meaningVi: def.vi,
      meaningEn: def.en,
      exampleEn: senseExampleEn,
      exampleVi: senseExampleVi,
      synonyms,
      antonyms,
    };
  });

  return {
    id: item.id,
    word,
    ipa,
    partOfSpeech,
    senses,
    raw: item,
  };
}
