import { create } from 'zustand';

interface Application {
  id: string;
  status: 'DRAFT' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  currentStep: number;
  stepData?: any;
  preferences?: any[];
  documents?: any[];
  generatedPdf?: any;
}

interface ApplicationState {
  application: Application | null;
  setApplication: (application: Application | null) => void;
  updateStep: (step: number) => void;
  updateStepData: (data: any) => void;
  clearApplication: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  application: null,
  
  setApplication: (application) => set({ application }),
  
  updateStep: (step) => set((state) => ({
    application: state.application ? { ...state.application, currentStep: step } : null
  })),
  
  updateStepData: (data) => set((state) => ({
    application: state.application ? {
      ...state.application,
      stepData: { ...state.application.stepData, ...data }
    } : null
  })),
  
  clearApplication: () => set({ application: null })
}));
