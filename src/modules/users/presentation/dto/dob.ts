export const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**Since don format is YYYY-MM-DD */
export function splitDob(dob:string): {year: string, month: string, day: string} {
    const [year, month, day] = dob.split('-');
    return {year, month, day};
}