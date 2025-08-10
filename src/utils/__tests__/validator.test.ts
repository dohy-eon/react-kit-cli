import { ProjectValidator } from '../validator';
import { ValidationError } from '../../types';

describe('ProjectValidator', () => {
  describe('validateProjectName', () => {
    it('유효한 프로젝트 이름을 통과해야 합니다', () => {
      const validNames = ['my-project', 'react-app', 'test123', 'my-app-2024'];

      validNames.forEach(name => {
        expect(() => ProjectValidator.validateProjectName(name)).not.toThrow();
      });
    });

    it('빈 프로젝트 이름을 거부해야 합니다', () => {
      expect(() => ProjectValidator.validateProjectName('')).toThrow(ValidationError);
      expect(() => ProjectValidator.validateProjectName('   ')).toThrow(ValidationError);
    });

    it('대문자가 포함된 프로젝트 이름을 거부해야 합니다', () => {
      expect(() => ProjectValidator.validateProjectName('MyProject')).toThrow(ValidationError);
      expect(() => ProjectValidator.validateProjectName('my-Project')).toThrow(ValidationError);
    });

    it('특수문자가 포함된 프로젝트 이름을 거부해야 합니다', () => {
      expect(() => ProjectValidator.validateProjectName('my_project')).toThrow(ValidationError);
      expect(() => ProjectValidator.validateProjectName('my@project')).toThrow(ValidationError);
      expect(() => ProjectValidator.validateProjectName('my.project')).toThrow(ValidationError);
    });

    it('너무 긴 프로젝트 이름을 거부해야 합니다', () => {
      const longName = 'a'.repeat(51);
      expect(() => ProjectValidator.validateProjectName(longName)).toThrow(ValidationError);
    });
  });

  describe('validateOptions', () => {
    it('Redux와 Recoil이 동시에 설정된 경우 경고를 표시해야 합니다', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      ProjectValidator.validateOptions({
        withRedux: true,
        withRecoil: true,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Redux와 Recoil을 동시에 사용하는 것은 권장하지 않습니다')
      );

      consoleSpy.mockRestore();
    });

    it('단일 상태관리 라이브러리만 사용하는 경우 경고를 표시하지 않아야 합니다', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      ProjectValidator.validateOptions({
        withRedux: true,
        withRecoil: false,
      });

      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Redux와 Recoil을 동시에 사용하는 것은 권장하지 않습니다')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('validateCreateProjectParams', () => {
    it('유효한 파라미터를 통과해야 합니다', () => {
      const validParams = {
        projectName: 'my-project',
        options: {
          withTailwind: true,
          withVitest: false,
        },
      };

      expect(() => ProjectValidator.validateCreateProjectParams(validParams)).not.toThrow();
    });

    it('유효하지 않은 프로젝트 이름으로 실패해야 합니다', () => {
      const invalidParams = {
        projectName: 'Invalid Project',
        options: {},
      };

      expect(() => ProjectValidator.validateCreateProjectParams(invalidParams)).toThrow(
        ValidationError
      );
    });
  });
});
