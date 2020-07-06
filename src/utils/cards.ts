import { MemoryCard } from '../store/main';
import { startOfTomorrow } from 'date-fns';
import { ADDITIONAL_DAYS } from './cardRules';

export interface CardsUpdate {
    cards: MemoryCard[];
}

const daysToAdd = (count: number): Date => {
    const additionalDays = ADDITIONAL_DAYS[count + ''];

    return additionalDays ? additionalDays() : ADDITIONAL_DAYS.DEFAULT();
};

const updateCard = (card: MemoryCard, correct: boolean, nextDate: Date) => {
    if (correct) {
        card.incorrectCount = 0;
        card.correctCount += 1;
    } else {
        card.incorrectCount += 1;
        card.correctCount = 0;
    }

    card.nextDate = nextDate;
    card.isPaused = undefined;
    card.lastAttempt = new Date();
};

export const wrong = (cards: MemoryCard[], id: number): CardsUpdate => {
    const card = cards.find((card) => card.id === id);
    if (!card) {
        throw new Error();
    }

    updateCard(card, false, ADDITIONAL_DAYS.WRONG());

    return { cards: cards };
};

export const right = (cards: MemoryCard[], id: number): CardsUpdate => {
    const card = cards.find((card) => card.id === id);
    if (!card) {
        throw new Error();
    }

    updateCard(card, true, daysToAdd(card.correctCount));

    return { cards: cards };
};

export const pause = (cards: MemoryCard[], id: number): CardsUpdate => {
    const card = cards.find((card) => card.id === id);
    if (!card) {
        throw new Error();
    }

    card.isPaused = new Date();
    return { cards: cards };
};

export const practise = (cards: MemoryCard[], id: number): CardsUpdate => {
    const card = cards.find((card) => card.id === id);
    if (!card) {
        throw new Error();
    }

    card.secondAttempt = new Date();
    return { cards: cards };
};

export const addCard = (cards: MemoryCard[]): MemoryCard[] => {
    const newCard = {
        id: cards.length + 1,
        correctCount: 0,
        incorrectCount: 0,
        nextDate: startOfTomorrow(),
        isPaused: undefined,
        secondAttempt: undefined,
        lastAttempt: undefined,
    };

    return [...cards, newCard];
};
