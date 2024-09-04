import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const useFormValidation = (validationSchema) => {
  return useForm({
    resolver: yupResolver(validationSchema),
  });
};

export default useFormValidation;
