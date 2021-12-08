import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Payment } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/payment.service';

function maxSplitMethods(max: number): ValidatorFn {
  return (c: AbstractControl): { maxSplit: boolean } | null => {
    const methods = c.get('methods').value;
    const methodsSelected = methods.filter(
      (x => x.percentage !== null && x.percentage !== 0)
    );
    if (methodsSelected.length > max) {
      return { maxSplit: true };
    }
    return null;
  };
}

function maxPercentage(): ValidatorFn {
  return (c: AbstractControl): { maxSplitPercentage: boolean } | null => {
    const methods = c.get('methods').value;
    const methodsSelected = methods.filter(x => x.percentage !== null);
    const percentages = methodsSelected.map(x => x.percentage)
    const totalPercentageAssigned = percentages.reduce(
      (previousValue, crrentValue) => previousValue + crrentValue, 0
    );
    if (totalPercentageAssigned > 100) {
      return { maxSplitPercentage: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-ejemplo-form',
  templateUrl: './ejemplo-form.component.html',
  styleUrls: ['./ejemplo-form.component.css']
})
export class EjemploFormComponent implements OnInit {

  percentageForm: FormGroup = new FormGroup({})
  payments: Payment[] = [];

  get methods(): FormArray {
    return this.percentageForm.get('methods') as FormArray;
  }

  constructor(private paymentService: PaymentService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this.paymentService.getPayments().subscribe(
      (response: Payment[]) => {
        this.payments = response;
        this.buildForm();
      },
      (err) => {
        console.log('Error: ', err);
      }
    )
  }

  save(): void {
    console.log(this.percentageForm);
    console.log('Saved: ' + JSON.stringify(this.percentageForm.value));
  }

  private buildForm() {
    this.percentageForm = this.fb.group({
      observations: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      methods: this.fb.array([])
    },
    { validators: [maxSplitMethods(3), maxPercentage()] });
    this.payments.forEach(x => this.methods.push(this.buildChildFormGroup(x)));
  }

  private buildChildFormGroup(payment: Payment) {
    return this.fb.group({
      id: payment.id,
      percentage: [payment.percentage, [Validators.min(20), Validators.max(100)]]
    });
  }

}
