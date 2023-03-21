import React, { useState } from 'react';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaGripVertical } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '@/utils/hooks/rtkhooks';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';
import { changeFormMaterialDelConfirmationModalStatus } from '@/utils/features/modalStateSlice';

export default function FormMaterialsList({
  formMaterials,
  selectedMaterialEdit,
  setSelectedMaterialEdit,
  rearrangeMaterialsByDnD,
  deleteFormMaterial
}: {
  formMaterials: any[];
  selectedMaterialEdit: any;
  setSelectedMaterialEdit: (material: any) => void;
  rearrangeMaterialsByDnD: (
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  deleteFormMaterial: (dataIndex: number) => void;
}) {
  const dispatch = useAppDispatch();

  const { formMaterialDelConfirmationModalOpen } = useAppSelector(
    (state) => state.modalState
  );
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number>();

  const toggleMaterialDelConfirmationModal = () => {
    if (formMaterialDelConfirmationModalOpen)
      dispatch(changeFormMaterialDelConfirmationModalStatus(false));
    else dispatch(changeFormMaterialDelConfirmationModalStatus(true));
  };

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    margin: `0 0 10px 0`,
    ...draggableStyle
  });

  const getGripStype = (isDragging: boolean) => {
    if (isDragging) return { color: '#00bfff' };
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    rearrangeMaterialsByDnD(result.source.index, result.destination.index);
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full md:w-[250px]"
            >
              {formMaterials.map((item: any, index: number) => (
                <Draggable
                  key={index}
                  draggableId={`${item.component}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      className={classNames(
                        'group w-full bg-white py-1 px-2 h-[50px] flex items-center my-1 md:my-2 hover:bg-gray-100 border border-solid border-gray-200 rounded-md',
                        {
                          'bg-gray-50': selectedMaterialEdit?.order === index
                        }
                      )}
                    >
                      <FaGripVertical
                        style={getGripStype(snapshot.isDragging)}
                        className="text-gray-600 mr-2"
                      />
                      <img
                        src={item.icon}
                        alt="Material Icon"
                        className="w-[20px]"
                      />
                      <p
                        className="font-medium ml-3 text-gray-800 flex-1"
                        onClick={() =>
                          setSelectedMaterialEdit({ ...item, order: index })
                        }
                      >
                        {item.title}
                      </p>
                      <button
                        className="hidden group-hover:flex ml-auto text-gray-600"
                        onClick={() => {
                          setSelectedMaterialIndex(index);
                          toggleMaterialDelConfirmationModal();
                        }}
                      >
                        <FaTrash className="text-[14px]" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {formMaterialDelConfirmationModalOpen && (
        <ConfirmationModal
          closeModal={() => toggleMaterialDelConfirmationModal()}
          title="Do you really want to delete this material?"
          subTitle="You will be redirect to see all of your forms after saving"
          onSubmit={() => {
            deleteFormMaterial(selectedMaterialIndex || 0);
            toggleMaterialDelConfirmationModal();
          }}
        />
      )}
    </>
  );
}
