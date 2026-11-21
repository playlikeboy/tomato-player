'use client';

import Link from 'next/link';
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';

export interface DocSection {
  section: string;
  items: { href: string; title: string }[];
}

export function DocsNav({ sections, pathname }: { sections: DocSection[]; pathname: string }) {
  return (
    <SideNav header={<SideNavHeading heading="Documentation" headingHref="/docs/" subheading="v0.1" />}>
      {sections.map((s) => (
        <SideNavSection key={s.section} title={s.section}>
          {s.items.map((item) => (
            <SideNavItem key={item.href} as={Link} label={item.title} href={item.href} isSelected={pathname === item.href} />
          ))}
        </SideNavSection>
      ))}
    </SideNav>
  );
}
