import { z } from 'zod';

// Basic data structures
export interface Task {
  id: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ResourceCardData {
  title: string;
  icon: string;
  items: string[];
}

export interface Week {
  id:string;
  title: string;
  description?: string;
  tasks: Task[];
  resources?: ResourceCardData[];
}

export interface Phase {
  id: string;
  title: string;
  weeks: Week[];
}

export interface GuideContent {
  title: string;
  points: string[];
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  gradient: string;
  structure?: string;
  tips?: string[];
  resources?: ResourceCardData[];
  content?: GuideContent[];
}

export type Section = Guide | {
  id: string;
  title: string;
  gradient: string;
  phases: Phase[];
};
