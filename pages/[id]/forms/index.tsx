import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import BasicLayout from '@/components/Layout/BasicLayout';
import Button from '@/components/FormBuilder/FormMaterials/Button';
import CreateNewFormModal from '@/components/Modals/CreateNewFormModal';
import LoaderComponent from '@/components/Loader';

import { changeCreateNewFormModalStatus } from '@/utils/features/modalStateSlice';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';

interface FormData {
  formName: string;
  redirectUrl: string;
  buttonText: string;
  buttonTheme: string;
}

const FormsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const router = useRouter();
  const createNewFormModalStatus = useAppSelector(
    (state) => state.modalState.createNewFormModalOpen
  );

  const [formsData, setFormsData] = useState<any[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoadingForms(true);
      (async () => {
        const { data, error, count } = await supabase
          .from('forms')
          .select(`*`, { count: 'exact' })
          .eq('user_id', user.id);
        if (error) {
          setIsLoadingForms(false);
          throw new Error(`${error.message}: ${error.details}`);
        }
        if (count === 0) {
          return null;
        }
        setIsLoadingForms(false);
        setFormsData(data);
      })();
    }
  }, [user?.id]);

  const createNewForm = async (formData: FormData) => {
    const formConfig = Array.from(Array(1).keys()).map((item) => {
      return {
        step: item,
        materials: []
      };
    });

    if (user?.id) {
      const { data, error } = await supabase
        .from('forms')
        .insert({
          form_name: formData.formName,
          user_id: user.id,
          button_text: formData.buttonText,
          button_theme_color: formData.buttonTheme,
          redirect_url: formData.redirectUrl,
          form_config: formConfig,
          form_theme_backgrounds: [
            { name: 'Default', url: '', saved: true },
            {
              name: 'Skype Blue',
              url: '/images/formThemeBackgrounds/skype_blue_gradient.png',
              text_color: '#ffffff',
              saved: true
            },
            {
              name: 'Red 123',
              url: '/images/formThemeBackgrounds/red_123.png',
              text_color: '#ffffff',
              saved: true
            }
          ]
        })
        .select('id')
        .single();
      if (error) {
        toast.dismiss();
        toast.error(error.message);
        return;
      }
      if (data) {
        toast.success('Successfully created new form');
        router.push(`/${user?.id}/forms/${data.id}/edit`);
      }
    }
  };
  return (
    <BasicLayout>
      <div className="flex flex-col py-6 px-4 h-full">
        {createNewFormModalStatus && (
          <CreateNewFormModal createNewForm={createNewForm} />
        )}
        <Button
          classes="self-end mt-5 bg-gray-100 text-gray-700"
          customBgColor
          onClickHandler={() => dispatch(changeCreateNewFormModalStatus(true))}
        >
          Create New Form
        </Button>

        <div className="mt-4 border-t border-solid border-gray-200 w-full flex-1 overflow-y-auto py-3">
          {isLoadingForms && (
            <div className="w-full h-full flex items-center justify-center">
              <LoaderComponent />
            </div>
          )}
          {!isLoadingForms && (
            <>
              <div className="flex w-full flex-wrap">
                {formsData &&
                  formsData.length > 0 &&
                  formsData.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        router.push(`/${user?.id}/forms/${item.id}/edit`)
                      }
                      className="flex flex-col cursor-pointer w-[200px] h-[120px] rounded-md overflow-hidden m-2 shadow-md"
                    >
                      <span
                        className="w-full h-[20px]"
                        style={{ backgroundColor: item.button_theme_color }}
                      ></span>
                      <div className="p-2">
                        <h1 className="font-medium">{item.form_name}</h1>
                      </div>
                    </motion.div>
                  ))}
              </div>
              {(!formsData || formsData.length === 0) && (
                <div className="flex-1 flex items-center justify-center h-full">
                  <p className="font-medium text-[14px] text-gray-700">
                    No data to show yet.{' '}
                    <span
                      onClick={() =>
                        dispatch(changeCreateNewFormModalStatus(true))
                      }
                      className="text-blue-700 cursor-pointer underline"
                    >
                      Create new form now
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default FormsPage;
