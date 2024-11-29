import Button from '@mui/material/Button';
import { SvgIconComponent } from '@mui/icons-material';
import "./IconButton.less"

export type IconButtonProps = {
    icon: SvgIconComponent;
    label?: string;
    onClick?: () => void;
}

/**
 * A custom button component that displays an icon and an optional label.
 * 
 * This component uses Material UI's `Button` component with an icon displayed 
 * at the start of the button. The label is optional and only shown if provided.
 * 
 * @param {Object} props - The props for the IconButton component.
 * @param {SvgIconComponent} props.icon - The icon to be displayed inside the button.
 * @param {string} [props.label] - An optional label to display next to the icon.
 * @param {Function} [props.onClick] - An optional callback function to be called when the button is clicked.
 * 
 * @returns {JSX.Element} The rendered IconButton component.
 */
export function IconButton({icon: Icon, label , onClick}:IconButtonProps) {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            startIcon={<Icon />}
            aria-label={label}
        >
             {label ? label : null}
        </Button>
    );
}


export default IconButton;