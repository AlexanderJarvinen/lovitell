export const JOB_TYPES = [
    {
        id: 'firmware',
        label: 'Смена прошивки'
    },
    {
        id: 'template',
        label: 'Применение шаблона'
    }
];

export const JOB_STATES = [
    {
        id: 'IDLE',
        label: 'Ожидание'
    },
    {
        id: 'INPROGRESS',
        label: 'В процессе',
    },
    {
        id: 'COMPLETE',
        label: 'Завершена'
    },
    {
        id: 'FAIL',
        label: 'Провалена'
    },
    {
        id: 'STOPPED',
        label: 'Остановлена'
    }
];