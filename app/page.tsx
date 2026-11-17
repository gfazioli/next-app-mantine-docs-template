import { Container } from '@mantine/core';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Content } from '@/components/Content/Content';
import { Welcome } from '@/components/Welcome/Welcome';

export default function HomePage() {
  return (
    <Container flex={1} w="100%">
      <Welcome />
      <ColorSchemeToggle />
      <Content />
    </Container>
  );
}
