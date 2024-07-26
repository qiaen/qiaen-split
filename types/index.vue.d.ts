declare function __VLS_template(): {
    A?(_: {}): any;
    B?(_: {}): any;
};
declare const __VLS_component: any;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
