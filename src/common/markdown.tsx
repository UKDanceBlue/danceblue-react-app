import type { RenderRules } from "@jonasmerlin/react-native-markdown-display";
import { renderRules } from "@jonasmerlin/react-native-markdown-display";

// This is a modified clone of https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
export const rules: RenderRules = {
  // when unknown elements are introduced, so it wont break
  unknown: renderRules.unknown,

  // The main container
  body: renderRules.body,

  // Headings
  heading1: renderRules.heading1,
  heading2: renderRules.heading2,
  heading3: renderRules.heading3,
  heading4: renderRules.heading4,
  heading5: renderRules.heading5,
  heading6: renderRules.heading6,

  // Horizontal Rule
  hr: renderRules.hr,

  // Emphasis
  strong: renderRules.strong,
  em: renderRules.em,
  s: renderRules.s,

  // Blockquotes
  blockquote: renderRules.blockquote,

  // Lists
  bullet_list: renderRules.bullet_list,
  ordered_list: renderRules.ordered_list,
  // this is a unique and quite annoying render rule because it has
  // child items that can be styled (the list icon and the list content)
  // outside of the AST tree so there are some work arounds in the
  // AST renderer specifically to get the styling right here
  list_item: renderRules.list_item,

  // Code
  code_inline: renderRules.code_inline,
  code_block: renderRules.code_block,
  fence: renderRules.fence,

  // Tables
  table: renderRules.table,
  thead: renderRules.thead,
  tbody: renderRules.tbody,
  th: renderRules.th,
  tr: renderRules.tr,
  td: renderRules.td,

  // Links
  link: renderRules.link,
  blocklink: renderRules.blocklink,

  // Images
  image: renderRules.image,

  // Text Output
  text: renderRules.text,
  textgroup: renderRules.textgroup,
  paragraph: renderRules.paragraph,
  hardbreak: renderRules.hardbreak,
  softbreak: renderRules.softbreak,

  // Believe these are never used but retained for completeness
  pre: renderRules.pre,
  inline: renderRules.inline,
  span: renderRules.span,
} as const;
