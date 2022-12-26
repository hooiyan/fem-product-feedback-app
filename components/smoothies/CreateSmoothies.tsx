import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Modal,
  NumberInput,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'lib/supabaseClient';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup
  .object({
    title: yup.string().required(),
    method: yup.string().required(),
    rating: yup.number().moreThan(-1).lessThan(11).required(),
  })
  .required();

type T = {
  opened: boolean;
  setOpened: (flag: boolean) => void;
};

const CreateSmoothies = ({ opened, setOpened }: T) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      method: '',
      rating: 0,
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = methods;
  const formValues = useWatch({ control, name: ['title', 'method', 'rating'] });
  const [title, method, rating] = formValues;
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (smoothies: {
      title: string;
      method: string;
      rating: number;
    }) => await supabase.from('smoothies').insert([{ title, method, rating }]),
    onSuccess: () => {
      showNotification({
        title: 'Success',
        message: `${title} has been added successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['smoothies'] });
      setOpened(false);
      reset();
    },
    onError: () => console.log('error'),
  });
  const onSubmit = (data: any) => {
    createMutation.mutate({ title, method, rating });
  };
  const onFormInvalid = (errors: any) => console.error(errors);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      title="Add new smoothies"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onFormInvalid)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Title"
                placeholder="Your smoothies title"
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="title"
            render={({ message }) => (
              <Text color="red" fz="sm">
                *{message}
              </Text>
            )}
          />
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Method"
                placeholder="Your recommended method"
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="method"
            render={({ message }) => (
              <Text color="red" fz="sm">
                *{message}
              </Text>
            )}
          />
          <Controller
            name="rating"
            control={control}
            render={({ field }) => <NumberInput {...field} label="Rating" />}
          />
          <ErrorMessage
            errors={errors}
            name="rating"
            render={({ message }) => (
              <Text color="red" fz="sm">
                *{message}
              </Text>
            )}
          />
          <Button mt={16} type="submit">
            Add
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default CreateSmoothies;
