'use client';

import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { HStack } from '@astryxdesign/core/Stack';
import { Page } from '@/components/blocks';

export function NotFound() {
  return (
    <Page width={800}>
      <EmptyState
        title="This page rolled away 🍅"
        description="The link may be old, or the page moved. Try search (press /), or start from one of these."
        actions={
          <HStack gap={2} wrap="wrap" hAlign="center">
            <Button label="Home" variant="primary" href="/" />
            <Button label="Docs" href="/docs/" />
            <Button label="Skins" href="/skins/" />
            <Button label="Demos" href="/demos/" />
          </HStack>
        }
      />
    </Page>
  );
}
