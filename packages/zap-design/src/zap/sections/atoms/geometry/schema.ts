export interface GeometrySettings {
    cardRadius: number;
    cardBorderWidth: number;
    cardMaxWidth: number;
    spacingCardPad: number;
    spacingFormGap: number;
    inputHeight: number;
    inputRadius: number;
    buttonHeight: number;
    buttonHeightLarge: number;
    buttonRadius: number;
    checkboxSize: number;
    checkboxRadius: number;
}

export const defaultGeometrySettings: GeometrySettings = {
    cardRadius: 12,
    cardBorderWidth: 1,
    cardMaxWidth: 400,
    spacingCardPad: 48,
    spacingFormGap: 24,
    inputHeight: 34,
    inputRadius: 6,
    buttonHeight: 34,
    buttonHeightLarge: 34,
    buttonRadius: 6,
    checkboxSize: 20,
    checkboxRadius: 4,
};
