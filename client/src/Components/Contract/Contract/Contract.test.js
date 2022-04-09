import { render, screen, fireEvent } from '@testing-library/react';
import Contract from "./Contract";

import { newContract, addStatement, userConfirm, userDeny, executeContract, getContract, payContract } from '../../../SmartContractUtilities/SmartContractUtilities.js';


const DOWN_ARROW = { keyCode: 40 };

// Make sure to mock the entire smart contract module's functions, which are used inside Contract.js
jest.mock('../../../SmartContractUtilities/SmartContractUtilities.js', () => {
    return {
        newContract: jest.fn(),
        addStatement: jest.fn(),
        userConfirm: jest.fn(),
        userDeny: jest.fn(),
        executeContract: jest.fn(),
        getContract: jest.fn(),
        payContract: jest.fn(),
    }
});


describe("testing Contract component", () => {
    // Mock empty functions
    window.alert = jest.fn();
    console.log = jest.fn();


    test("success new contract with args", async () => {

        render(<Contract newContract={true}/>);

        newContract.mockReturnValueOnce(true);
        addStatement.mockReturnValue(true);

        // Select a condition
        fireEvent.keyDown(screen.getAllByRole("combobox")[0], DOWN_ARROW);
        await screen.findByText("User Balance");

        fireEvent.click(screen.getByText("User Balance"));


        // Select a consequent
        fireEvent.keyDown(screen.getAllByRole("combobox")[2], DOWN_ARROW);
        await screen.findByText("Pay User");

        fireEvent.click(screen.getByText("Pay User"));


        // Select an alternative
        fireEvent.keyDown(screen.getAllByRole("combobox")[4], DOWN_ARROW);
        await screen.findByText("Refund All");

        fireEvent.click(screen.getByText("Refund All"));


        // Fill all possible inputs with a "1"
        screen.getAllByRole("textbox").forEach(e => {
            fireEvent.change(e, {target: {value: '1'}})
        });

        // Create contract
        screen.getByText("Create").click();


        expect(newContract).toHaveBeenCalledTimes(1);
    });


    test("fail contract name", () => {

        render(<Contract newContract={true}/>);

        newContract.mockReturnValueOnce(false);

        screen.getByText("Create").click();

        expect(newContract).toHaveBeenCalledTimes(1);

        expect(addStatement).toHaveBeenCalledTimes(0);

        expect(getContract).toHaveBeenCalledTimes(0);
    });


    test("progress button", () => {

        render(<Contract newContract={true}/>);
    
        executeContract.mockReturnValueOnce(true);

        screen.getByText("Progress").click();

        expect(executeContract).toHaveBeenCalledTimes(1);
    });

    test("confirm button", () => {

        render(<Contract newContract={true}/>);

        userConfirm.mockReturnValueOnce(true);

        screen.getByText("Confirm").click();

        expect(userConfirm).toHaveBeenCalledTimes(1);
    });


    test("deny button", () => {

        render(<Contract newContract={true}/>);

        userDeny.mockReturnValueOnce(true);

        screen.getByText("Deny").click();

        expect(userDeny).toHaveBeenCalledTimes(1);
    });


    test("fund button", () => {

        render(<Contract newContract={true}/>);

        payContract.mockReturnValueOnce(true);

        screen.getByText("Fund Contract").click();

        expect(payContract).toHaveBeenCalledTimes(1);
    });
});
