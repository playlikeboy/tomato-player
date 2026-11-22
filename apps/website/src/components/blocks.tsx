'use client';

// Shared page building blocks, all composed from Astryx components.
import React, { useState, type ReactNode } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Breadcrumbs, BreadcrumbItem } from '@astryxdesign/core/Breadcrumbs';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Table } from '@astryxdesign/core/Table';
import { pixel } from '@astryxdesign/core/Table/utils';
import { Text } from '@astryxdesign/core/Text';

/** Page container: centered, readable width, consistent padding. */
export function Page({ children, width = 1200 }: { children: ReactNode; width?: number }) {
  return (
    <VStack as="article" gap={8} paddingInline={6} paddingBlock={8} maxWidth={width} width="100%" data-pagefind-body="">
      {children}
    </VStack>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  trail,
  actions,
  badges,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  trail?: [string, string][];
  actions?: ReactNode;
  badges?: string[];
}) {
  return (
    <VStack gap={3}>
      {trail && (
        <Breadcrumbs label="Breadcrumb">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          {trail.map(([label, href], i) => (
            <BreadcrumbItem key={href} href={i === trail.length - 1 ? undefined : href}>
              {label}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      )}
      <HStack gap={3} vAlign="center" wrap="wrap">
        <Heading level={1} type="display-2">
          {title}
        </Heading>
        {badges?.map((b) => <Badge key={b} label={b} variant={b === 'Unofficial' ? 'warning' : 'neutral'} />)}
      </HStack>
      {eyebrow?.startsWith('@') && (
        <Text type="code" color="secondary">
          {eyebrow}
        </Text>
      )}
      {lead && (
        <Text type="large" color="secondary" as="p" textWrap="pretty">
          {lead}
        </Text>
      )}
      {actions && (
        <HStack gap={2} wrap="wrap">
          {actions}
        </HStack>
      )}
    </VStack>
  );
}

export function SectionTitle({ title, lead, id }: { title: string; lead?: ReactNode; id?: string }) {
  return (
    <VStack gap={2}>
      <Heading level={2} id={id}>
        {title}
      </Heading>
      {lead && (
        <Text color="secondary" as="p" textWrap="pretty">
          {lead}
        </Text>
      )}
    </VStack>
  );
}

export interface CodeTab {
  id: string;
  label: string;
  code: string;
  language: string;
  title?: string;
}

export function CodeTabs({ tabs, label = 'Code examples' }: { tabs: CodeTab[]; label?: string }) {
  const [value, setValue] = useState(tabs[0]!.id);
  const tab = tabs.find((t) => t.id === value) ?? tabs[0]!;
  return (
    <VStack gap={2}>
      <TabList value={value} onChange={setValue} hasDivider role="tablist" aria-label={label}>
        {tabs.map((t) => (
          <Tab key={t.id} value={t.id} label={t.label} />
        ))}
      </TabList>
      <CodeBlock code={tab.code} language={tab.language} title={tab.title} width="100%" />
    </VStack>
  );
}

export function Code({ code, language = 'tsx', title }: { code: string; language?: string; title?: string }) {
  return <CodeBlock code={code} language={language} title={title} width="100%" />;
}

export function OptionsTable({ rows }: { rows: { name: string; type: string; description: string }[] }) {
  if (!rows.length) return <Text color="secondary">This one takes no options.</Text>;
  return (
    <Table
      data={rows}
      idKey="name"
      density="balanced"
      columns={[
        { key: 'name', header: 'Option', width: pixel(180), renderCell: (r) => <Text type="code">{r.name}</Text> },
        { key: 'type', header: 'Type', width: pixel(220), renderCell: (r) => <Text type="code" color="secondary">{r.type}</Text> },
        { key: 'description', header: 'Description' },
      ]}
    />
  );
}

/** Plain anchor for links to static files outside the Next.js router (no prefetch, no base-path rewrite). */
export const PlainLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />;
