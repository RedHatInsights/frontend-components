import { required, minLength } from '../Validators/validators';

export default validationType => ({
    required,
    minLength
})[validationType];
