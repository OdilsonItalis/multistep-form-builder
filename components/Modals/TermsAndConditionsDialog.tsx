import * as React from 'react';
import { RadioGroup } from '@headlessui/react';
import { useAppDispatch } from '@/utils/hooks/rtkhooks';
import { changeTermsAndConditionsModalStatus } from '@/utils/features/modalStateSlice';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import ArrowSmallLeft from 'public/icons/ArrowSmallLeft';

export default function TermsAndConditionsDialog() {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(changeTermsAndConditionsModalStatus(false));
  };

  const [option, setOption] = React.useState<
    'terms' | 'privacy' | 'disclaimer' | 'eula'
  >('terms');

  return (
    <Dialog className="fixed inset-0 z-10" onClose={handleClose} open={true}>
      <div className="flex flex-col justify-center h-full px-1 pt-12 text-center sm:block sm:p-0">
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="fixed inset-0 bg-black/40"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
          }}
          exit={{
            y: '100%',
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
          }}
          className="z-0 flex flex-col w-full h-full bg-white rounded-t-lg shadow-xl max-w-2xl mx-auto overflow-scroll"
        >
          <div className="flex flex-col h-full px-2 max-w-4xl mx-auto w-full">
            <button
              className="mr-auto my-2"
              color="inherit"
              onClick={handleClose}
            >
              <ArrowSmallLeft height={20} width={20} />
            </button>
            <div className="flex flex-col gap-2">
              {/* <div className="bg-gray-100 h-10 flex items-center px-4 rounded-lg">
              terms and conditions
            </div>
            <div className="bg-gray-100 h-10 flex items-center px-4 rounded-lg">
              privacy policy
            </div>
            <div className="bg-gray-100 h-10 flex items-center px-4 rounded-lg">
              cookie policy
            </div> */}
              <RadioGroup
                value={option}
                onChange={setOption}
                className="flex flex-col bg-white gap-2 pb-6"
              >
                <RadioGroup.Option className="w-full" value="terms">
                  {({ checked }) => (
                    <div
                      className={`relative flex h-12 justify-between rounded-lg items-center border bg-white p-2  ${
                        checked &&
                        'ring-2 ring-cyan-400 shadow-xl shadow-cyan-400/20'
                      }                
                `}
                    >
                      <p className="">Terms And Conditions</p>
                    </div>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option className="w-full" value="privacy">
                  {({ checked }) => (
                    <div
                      className={`relative flex h-12 justify-between rounded-lg items-center border bg-white p-2  ${
                        checked &&
                        'ring-2 ring-cyan-400 shadow-xl shadow-cyan-400/20'
                      }                
                `}
                    >
                      <p className="">Privacy Policy</p>
                    </div>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option className="w-full" value="disclaimer">
                  {({ checked }) => (
                    <div
                      className={`relative flex h-12 justify-between rounded-lg items-center border bg-white p-2  ${
                        checked &&
                        'ring-2 ring-cyan-400 shadow-xl shadow-cyan-400/20'
                      }                
                `}
                    >
                      <p className="">Disclaimer</p>
                    </div>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option className="w-full" value="eula">
                  {({ checked }) => (
                    <div
                      className={`relative flex h-12 justify-between rounded-lg items-center border bg-white p-2  ${
                        checked &&
                        'ring-2 ring-cyan-400 shadow-xl shadow-cyan-400/20'
                      }                
                `}
                    >
                      <p className="">End User License Agreement</p>
                    </div>
                  )}
                </RadioGroup.Option>
              </RadioGroup>
            </div>
            {option === 'terms' && (
              <iframe
                src="https://app.termly.io/document/terms-of-use-for-saas/832f9322-eb1e-4455-bb91-e7972f931d1a"
                width="100%"
                height="100%"
              ></iframe>
            )}
            {option === 'privacy' && (
              <iframe
                src="https://app.termly.io/document/privacy-policy/d36aa74b-52ec-4f14-89d2-3d988174bf2b"
                width="100%"
                height="100%"
              ></iframe>
            )}
            {option === 'disclaimer' && (
              <iframe
                src="https://app.termly.io/document/disclaimer/5e6483df-c1f7-43fc-b502-6147cb8f7682"
                width="100%"
                height="100%"
              ></iframe>
            )}
            {option === 'eula' && (
              <iframe
                src="https://app.termly.io/document/eula/a61e59d8-590a-4e62-ab06-12bfceec9a17"
                width="100%"
                height="100%"
              ></iframe>
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}
