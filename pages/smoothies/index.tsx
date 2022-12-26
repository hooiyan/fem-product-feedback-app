import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import CreateSmoothies from 'components/smoothies/CreateSmoothies';
import { supabase } from 'lib/supabaseClient';
import { useState } from 'react';

const fetchSmoothies = async () => {
  const result = await supabase.from('smoothies').select();
  return result;
};

export default function Smoothies() {
  const [opened, setOpened] = useState(false);
  const smoothiesQuery = useQuery(['smoothies'], fetchSmoothies);

  return (
    <>
      {smoothiesQuery.isLoading && (
        <LoadingOverlay
          visible={smoothiesQuery.isLoading}
          overlayBlur={2}
          transitionDuration={500}
        />
      )}
      <Group align="center" position="apart">
        <Title mb={16}>Super Smoothies</Title>
        <ActionIcon variant="filled" onClick={() => setOpened(true)}>
          <IconPlus size={20} />
        </ActionIcon>
      </Group>
      {smoothiesQuery.isSuccess && smoothiesQuery['data']['data'] !== null && (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 1280, cols: 3, spacing: 'md' },
            { maxWidth: 768, cols: 2, spacing: 'sm' },
            { maxWidth: 500, cols: 1, spacing: 'sm' },
          ]}
        >
          {smoothiesQuery['data']['data'].map((smoothie) => (
            <Card key={smoothie.id} shadow="sm" p="lg" radius="md" withBorder>
              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>
                  {smoothie.id}. {smoothie.title}
                </Text>
                <Badge color="blue" variant="light">
                  {smoothie.rating}
                </Badge>
              </Group>

              <Text size="sm" color="dimmed">
                {smoothie.method}
              </Text>

              <Group grow>
                <Button variant="light" color="teal" mt="md" radius="md">
                  Edit
                </Button>
                <Button variant="light" color="red" mt="md" radius="md">
                  Delete
                </Button>
              </Group>
            </Card>
          ))}
          <CreateSmoothies opened={opened} setOpened={setOpened} />
        </SimpleGrid>
      )}
    </>
  );
}
