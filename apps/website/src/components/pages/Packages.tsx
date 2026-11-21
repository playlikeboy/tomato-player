'use client';

import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { Link } from '@astryxdesign/core/Link';
import { Table } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { Code, Page, PageHeader } from '@/components/blocks';
import { SITE } from '@/lib/site';

type Row = { name: string; kind: string; description: string; size: string; dir: string };

const KIND_VARIANT: Record<string, 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'teal' | 'neutral'> = {
  core: 'red',
  ui: 'orange',
  bundle: 'purple',
  skin: 'green',
  plugin: 'blue',
  provider: 'teal',
  integration: 'neutral',
};

export function PackagesTable({ rows }: { rows: Row[] }) {
  return (
    <Page width={1200}>
      <PageHeader
        trail={[['Packages', '/packages/']]}
        eyebrow="npm"
        title="Packages"
        lead={`${rows.length} packages, versioned together. Install only what you use: sizes are minified and gzipped, measured at build time.`}
      />
      <Code code="npm i @tomato-player/core @tomato-player/skin-minimal" language="bash" />
      <Card padding={0}>
        <Table
          data={rows}
          idKey="name"
          hasHover
          columns={[
            {
              key: 'name',
              header: 'Package',
              renderCell: (r) => (
                <Link href={`${SITE.repo}/tree/main/${r.dir}`} isExternalLink>
                  <Text type="code">{r.name}</Text>
                </Link>
              ),
            },
            { key: 'kind', header: 'Kind', renderCell: (r) => <Badge label={r.kind} variant={KIND_VARIANT[r.kind] ?? 'neutral'} /> },
            { key: 'size', header: 'Gzip', align: 'end', renderCell: (r) => <Text hasTabularNumbers>{r.size}</Text> },
            { key: 'description', header: 'What it does' },
          ]}
        />
      </Card>
    </Page>
  );
}
